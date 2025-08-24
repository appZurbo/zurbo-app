
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EscrowPayment {
  id: string;
  conversation_id?: string;
  pedido_id?: string;
  stripe_payment_intent_id?: string;
  stripe_account_id?: string;
  amount: number;
  currency: string;
  zurbo_fee?: number;
  status: 'pending' | 'authorized' | 'captured' | 'refunded' | 'disputed' | 'failed';
  created_at: string;
  authorized_at?: string;
  captured_at?: string;
  auto_release_date?: string;
  dispute_reason?: string;
  dispute_images?: string[];
}

export const useEscrowPayment = () => {
  const [loading, setLoading] = useState(false);

  const createEscrowPayment = useCallback(async (
    conversationId: string,
    amount: number,
    currency: string = 'BRL'
  ) => {
    setLoading(true);
    try {
      const zurboFee = amount * 0.08; // Taxa alterada de 5% para 8%
      
      // Criar pagamento escrow no Supabase
      const { data, error } = await supabase
        .from('escrow_payments')
        .insert({
          conversation_id: conversationId,
          amount,
          currency,
          zurbo_fee: zurboFee,
          status: 'pending',
          auto_release_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
        })
        .select()
        .single();

      if (error) throw error;

      // Chamar edge function para criar Payment Intent no Stripe
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke('create-escrow-payment', {
        body: {
          escrowPaymentId: data.id,
          amount: amount * 100, // Stripe usa centavos
          currency: currency.toLowerCase()
        }
      });

      if (stripeError) throw stripeError;

      // Atualizar com payment_intent_id do Stripe
      const { error: updateError } = await supabase
        .from('escrow_payments')
        .update({ stripe_payment_intent_id: stripeData.payment_intent_id })
        .eq('id', data.id);

      if (updateError) throw updateError;

      return { 
        ...data, 
        client_secret: stripeData.client_secret,
        payment_intent_id: stripeData.payment_intent_id
      };
    } catch (error) {
      console.error('Error creating escrow payment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o pagamento.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const releasePayment = useCallback(async (escrowPaymentId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('capture-escrow-payment', {
        body: { escrowPaymentId }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Pagamento liberado com sucesso!",
      });
    } catch (error) {
      console.error('Error releasing payment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível liberar o pagamento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createDispute = useCallback(async (
    escrowPaymentId: string, 
    reason: string, 
    images?: string[]
  ) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('escrow_payments')
        .update({
          status: 'disputed',
          dispute_reason: reason,
          dispute_images: images || []
        })
        .eq('id', escrowPaymentId);

      if (error) throw error;

      toast({
        title: "Disputa Criada",
        description: "Sua disputa foi registrada e será analisada.",
      });
    } catch (error) {
      console.error('Error creating dispute:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a disputa.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getEscrowPayments = useCallback(async (conversationId?: string) => {
    try {
      let query = supabase.from('escrow_payments').select('*');
      
      if (conversationId) {
        query = query.eq('conversation_id', conversationId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add zurbo_fee to data if missing (for backward compatibility)
      const processedData = (data || []).map((payment: any) => ({
        ...payment,
        zurbo_fee: payment.zurbo_fee || (payment.amount * 0.08) // Taxa alterada de 5% para 8%
      }));

      return processedData as EscrowPayment[];
    } catch (error) {
      console.error('Error fetching escrow payments:', error);
      return [];
    }
  }, []);

  return {
    loading,
    createEscrowPayment,
    releasePayment,
    createDispute,
    getEscrowPayments
  };
};
