
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/utils/toast";
import { useAuth } from '@/hooks/useAuth';

export interface StripeAccount {
  id: string;
  user_id: string;
  stripe_account_id: string;
  account_type: string;
  charges_enabled: boolean;
  details_submitted: boolean;
}

export const useStripeConnect = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createStripeAccount = useCallback(async () => {
    if (!user?.id) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-account', {
        body: { userId: user.id }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conta Stripe criada com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a conta Stripe.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const getStripeAccount = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('stripe_accounts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching Stripe account:', error);
        return null;
      }

      return data as StripeAccount | null;
    } catch (error) {
      console.error('Error fetching Stripe account:', error);
      return null;
    }
  }, [user?.id]);

  const getAccountLink = useCallback(async (accountId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-account-link', {
        body: { accountId }
      });

      if (error) throw error;
      return data.url;
    } catch (error) {
      console.error('Error creating account link:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o link da conta.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    createStripeAccount,
    getStripeAccount,
    getAccountLink
  };
};
