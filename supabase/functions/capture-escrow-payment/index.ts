
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

    const { escrowPaymentId } = await req.json();

    // Buscar dados do pagamento escrow
    const { data: escrowPayment, error: escrowError } = await supabaseClient
      .from('escrow_payments')
      .select('*')
      .eq('id', escrowPaymentId)
      .single();

    if (escrowError || !escrowPayment || !escrowPayment.stripe_payment_intent_id) {
      throw new Error('Escrow payment not found or invalid');
    }

    if (escrowPayment.status !== 'authorized') {
      throw new Error('Payment not authorized for capture');
    }

    // Capturar o Payment Intent
    const capturedPayment = await stripe.paymentIntents.capture(
      escrowPayment.stripe_payment_intent_id
    );

    // Atualizar status no banco
    await supabaseClient
      .from('escrow_payments')
      .update({
        status: 'captured',
        captured_at: new Date().toISOString()
      })
      .eq('id', escrowPaymentId);

    // Criar registro de transação
    await supabaseClient
      .from('transactions')
      .insert({
        escrow_payment_id: escrowPaymentId,
        amount: escrowPayment.amount,
        type: 'escrow_capture',
        description: 'Liberação de pagamento escrow'
      });

    return new Response(
      JSON.stringify({
        success: true,
        payment_intent_id: capturedPayment.id,
        status: capturedPayment.status
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error capturing escrow payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
