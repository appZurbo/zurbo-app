
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
    const { escrowPaymentId, amount, currency = 'brl' } = await req.json();

    // Criar cliente Supabase com service role para bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Buscar detalhes do pagamento escrow
    const { data: escrowPayment, error: escrowError } = await supabaseClient
      .from('escrow_payments')
      .select(`
        *,
        chat_conversations!inner(
          cliente_id,
          prestador_id,
          servico_solicitado,
          cliente:users!chat_conversations_cliente_id_fkey(nome, email),
          prestador:users!chat_conversations_prestador_id_fkey(nome, email)
        )
      `)
      .eq('id', escrowPaymentId)
      .single();

    if (escrowError || !escrowPayment) {
      throw new Error('Pagamento escrow não encontrado');
    }

    // Inicializar Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const conversation = escrowPayment.chat_conversations;
    const clientEmail = conversation.cliente?.email;

    if (!clientEmail) {
      throw new Error('Email do cliente não encontrado');
    }

    // Verificar se já existe customer no Stripe
    const customers = await stripe.customers.list({ 
      email: clientEmail,
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Criar sessão de checkout do Stripe para pagamento com retenção
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : clientEmail,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `Serviço: ${conversation.servico_solicitado}`,
              description: `Prestador: ${conversation.prestador?.nome}`
            },
            unit_amount: amount, // Já vem em centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        // Configurar para retenção - o dinheiro fica retido até liberação manual
        capture_method: 'manual',
        metadata: {
          escrow_payment_id: escrowPaymentId,
          conversation_id: conversation.id,
          type: 'escrow'
        }
      },
      success_url: `${req.headers.get("origin")}/conversas?payment=success&escrow_id=${escrowPaymentId}`,
      cancel_url: `${req.headers.get("origin")}/conversas?payment=canceled`,
      metadata: {
        escrow_payment_id: escrowPaymentId,
        conversation_id: conversation.id
      }
    });

    // Atualizar escrow payment com payment intent ID
    await supabaseClient
      .from('escrow_payments')
      .update({ 
        stripe_payment_intent_id: session.payment_intent,
        status: 'pending'
      })
      .eq('id', escrowPaymentId);

    return new Response(
      JSON.stringify({ 
        checkout_url: session.url,
        payment_intent_id: session.payment_intent 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error creating escrow payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
