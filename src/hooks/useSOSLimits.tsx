
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SOSUsage {
  current: number;
  limit: number;
  remaining: number;
}

export const useSOSLimits = () => {
  const [sosUsage, setSOSUsage] = useState<SOSUsage>({ current: 0, limit: 3, remaining: 3 });
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();

  const loadSOSUsage = useCallback(async () => {
    if (!profile) return;

    try {
      const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
      const { data } = await supabase
        .from('sos_usage')
        .select('usage_count')
        .eq('user_id', profile.id)
        .eq('usage_month', currentMonth)
        .single();

      const current = data?.usage_count || 0;
      const limit = profile.premium ? 7 : 3;
      
      setSOSUsage({
        current,
        limit,
        remaining: Math.max(0, limit - current)
      });
    } catch (error) {
      console.error('Error loading SOS usage:', error);
    }
  }, [profile]);

  const canUseSOS = useCallback(() => {
    return sosUsage.remaining > 0;
  }, [sosUsage]);

  const useSOS = useCallback(async () => {
    if (!profile || !canUseSOS()) return false;

    setLoading(true);
    try {
      const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
      
      await supabase
        .from('sos_usage')
        .upsert({
          user_id: profile.id,
          usage_month: currentMonth,
          usage_count: sosUsage.current + 1
        });

      await loadSOSUsage();
      return true;
    } catch (error) {
      console.error('Error using SOS:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a solicitação SOS.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [profile, sosUsage, canUseSOS, loadSOSUsage, toast]);

  useEffect(() => {
    loadSOSUsage();
  }, [loadSOSUsage]);

  return {
    sosUsage,
    loading,
    canUseSOS,
    useSOS,
    loadSOSUsage
  };
};
