
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useOnDutyStatus = () => {
  const { profile, isPrestador } = useAuth();
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load initial status
  useEffect(() => {
    if (profile && isPrestador) {
      setIsOnDuty(profile.em_servico || false);
    }
  }, [profile, isPrestador]);

  const toggleOnDuty = useCallback(async () => {
    if (!profile || !isPrestador) return;

    setLoading(true);
    try {
      const newStatus = !isOnDuty;
      
      const { error } = await supabase
        .from('users')
        .update({ em_servico: newStatus })
        .eq('id', profile.id);

      if (error) throw error;

      setIsOnDuty(newStatus);
      
      if (newStatus) {
        toast.success("Você está Em Serviço! Agora você receberá chamados de emergência SOS");
      } else {
        toast.error("Você saiu de serviço - Você não receberá mais chamados de emergência");
      }

    } catch (error) {
      console.error('Error updating on-duty status:', error);
      toast.error("Não foi possível atualizar seu status. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [profile, isPrestador, isOnDuty]);

  return {
    isOnDuty,
    loading,
    toggleOnDuty,
    canToggle: isPrestador && !!profile
  };
};
