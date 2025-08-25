
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, amount, currency = 'BRL' } = await req.json();
    
    if (!conversationId || !amount) {
      throw new Error("Missing required parameters");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get conversation details
    const { data: conversation, error: convError } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        cliente:users!cliente_id(email, nome),
        prestador:users!prestador_id(nome, stripe_account_id)
      `)
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      throw new Error("Conversation not found");
    }

    const zurboFee = amount * 0.08; // 8% fee
    const amountInCents = Math.round(amount * 100);

    // Check if Stripe customer exists or create new one
    let customerId: string;
    const customers = await stripe.customers.list({
      email: conversation.cliente.email,
      limit: 1
    });

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: conversation.cliente.email,
        name: conversation.cliente.nome,
        metadata: {
          user_id: conversation.cliente_id
        }
      });
      customerId = customer.id;
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      customer: customerId,
      metadata: {
        conversation_id: conversationId,
        provider_account_id: conversation.prestador.stripe_account_id || '',
        zurbo_fee: Math.round(zurboFee * 100).toString(),
        customer_email: conversation.cliente.email, // Moved to metadata
      },
      description: `Serviço: ${conversation.servico_solicitado} - Prestador: ${conversation.prestador.nome}`,
    });

    // Create escrow payment record
    const { data: escrowPayment, error: escrowError } = await supabase
      .from('escrow_payments')
      .insert({
        conversation_id: conversationId,
        amount,
        currency,
        zurbo_fee: zurboFee,
        stripe_payment_intent_id: paymentIntent.id,
        status: 'pending',
        auto_release_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (escrowError) {
      console.error("Error creating escrow payment:", escrowError);
      throw new Error("Failed to create escrow payment record");
    }

    return new Response(
      JSON.stringify({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        escrow_payment_id: escrowPayment.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating escrow payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
