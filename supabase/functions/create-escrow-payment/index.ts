
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const { escrowPaymentId, amount, currency } = await req.json();

    // Buscar dados do pagamento escrow
    const { data: escrowPayment, error: escrowError } = await supabaseClient
      .from('escrow_payments')
      .select(`
        *,
        chat_conversations:conversation_id (
          cliente_id,
          prestador_id,
          users:prestador_id (
            email,
            stripe_accounts (
              stripe_account_id
            )
          )
        )
      `)
      .eq('id', escrowPaymentId)
      .single();

    if (escrowError || !escrowPayment) {
      throw new Error('Escrow payment not found');
    }

    // Criar Payment Intent com captura manual
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      capture_method: 'manual', // Captura manual para escrow
      automatic_payment_methods: {
        enabled: true,
      },
      transfer_data: escrowPayment.chat_conversations?.users?.stripe_accounts?.[0] ? {
        destination: escrowPayment.chat_conversations.users.stripe_accounts[0].stripe_account_id,
        amount: Math.floor(amount * 0.95), // 95% para o prestador (5% fee Zurbo)
      } : undefined,
      metadata: {
        escrow_payment_id: escrowPaymentId,
        type: 'escrow_service_payment'
      }
    });

    // Criar Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_intent_data: {
        setup_future_usage: 'off_session',
      },
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Pagamento de Serviço - ZURBO',
              description: 'Pagamento seguro retido até a conclusão do serviço',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/conversas?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/conversas?payment=cancelled`,
      metadata: {
        escrow_payment_id: escrowPaymentId,
      }
    });

    // Atualizar o pagamento escrow com os IDs do Stripe
    await supabaseClient
      .from('escrow_payments')
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        status: 'pending'
      })
      .eq('id', escrowPaymentId);

    return new Response(
      JSON.stringify({
        payment_intent_id: paymentIntent.id,
        checkout_url: session.url,
        client_secret: paymentIntent.client_secret
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
