
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
    const { escrowPaymentId } = await req.json();
    
    if (!escrowPaymentId) {
      throw new Error("Missing escrow payment ID");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get escrow payment details
    const { data: escrowPayment, error: escrowError } = await supabase
      .from('escrow_payments')
      .select(`
        *,
        conversation:chat_conversations(
          prestador:users!prestador_id(stripe_account_id)
        )
      `)
      .eq('id', escrowPaymentId)
      .single();

    if (escrowError || !escrowPayment) {
      throw new Error("Escrow payment not found");
    }

    if (escrowPayment.status !== 'authorized') {
      throw new Error("Payment not authorized for capture");
    }

    const providerAccountId = escrowPayment.conversation.prestador.stripe_account_id;
    if (!providerAccountId) {
      throw new Error("Provider Stripe account not configured");
    }

    // Calculate transfer amount (total - zurbo fee)
    const transferAmount = Math.round((escrowPayment.amount - escrowPayment.zurbo_fee) * 100);

    // Create transfer to provider
    const transfer = await stripe.transfers.create({
      amount: transferAmount,
      currency: escrowPayment.currency.toLowerCase(),
      destination: providerAccountId,
      description: `Payment release for escrow ${escrowPaymentId}`,
    });

    // Update escrow payment status
    const { error: updateError } = await supabase
      .from('escrow_payments')
      .update({
        status: 'captured',
        captured_at: new Date().toISOString(),
      })
      .eq('id', escrowPaymentId);

    if (updateError) {
      console.error("Error updating escrow payment:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        transfer_id: transfer.id,
        amount_transferred: transferAmount / 100,
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
