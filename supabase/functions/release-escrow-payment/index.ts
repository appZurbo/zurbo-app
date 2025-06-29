
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

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Buscar pagamento escrow
    const { data: escrowPayment, error: escrowError } = await supabaseClient
      .from('escrow_payments')
      .select('*')
      .eq('id', escrowPaymentId)
      .single();

    if (escrowError || !escrowPayment) {
      throw new Error('Pagamento escrow não encontrado');
    }

    if (escrowPayment.status !== 'held') {
      throw new Error('Pagamento não está retido');
    }

    // Inicializar Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Capturar o pagamento no Stripe (liberar da retenção)
    await stripe.paymentIntents.capture(escrowPayment.stripe_payment_intent_id);

    // Atualizar status no banco
    await supabaseClient
      .from('escrow_payments')
      .update({ 
        status: 'released',
        released_at: new Date().toISOString()
      })
      .eq('id', escrowPaymentId);

    // Registrar transação
    await supabaseClient
      .from('transactions')
      .insert({
        escrow_payment_id: escrowPaymentId,
        type: 'release',
        amount: escrowPayment.amount,
        description: 'Pagamento liberado após conclusão do serviço'
      });

    // Atualizar status da conversa
    if (escrowPayment.conversation_id) {
      await supabaseClient
        .from('chat_conversations')
        .update({ status: 'concluido' })
        .eq('id', escrowPayment.conversation_id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error releasing escrow payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
