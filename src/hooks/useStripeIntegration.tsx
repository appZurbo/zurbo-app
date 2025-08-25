
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface StripeSubscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  plan_name: string;
  current_period_end: string;
  customer_id: string;
}

export const useStripeIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<StripeSubscription | null>(null);
  const { profile } = useAuth();
  const { toast } = useToast();

  const createCheckoutSession = useCallback(async (priceId: string) => {
    if (!profile) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para continuar",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          priceId,
          customerId: profile.id,
          customerEmail: profile.email
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      if (data.url) {
        window.open(data.url, '_blank');
      }

      return data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o checkout",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [profile, toast]);

  const checkSubscriptionStatus = useCallback(async () => {
    if (!profile) return null;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription-status', {
        body: { userId: profile.id }
      });

      if (error) throw error;

      setSubscription(data.subscription);
      return data.subscription;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return null;
    }
  }, [profile]);

  const createCustomerPortal = useCallback(async () => {
    if (!profile) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-customer-portal', {
        body: { userId: profile.id }
      });

      if (error) throw error;

      // Open customer portal in a new tab
      if (data.url) {
        window.open(data.url, '_blank');
      }

      return data;
    } catch (error) {
      console.error('Error creating customer portal:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal do cliente",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [profile, toast]);

  return {
    loading,
    subscription,
    createCheckoutSession,
    checkSubscriptionStatus,
    createCustomerPortal
  };
};
