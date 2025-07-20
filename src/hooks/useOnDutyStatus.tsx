import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useOnDutyStatus = () => {
  const { profile, isPrestador } = useAuth();
  const { toast } = useToast();
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
      
      toast({
        title: newStatus ? "Você está Em Serviço!" : "Você saiu de serviço",
        description: newStatus 
          ? "Agora você receberá chamados de emergência SOS" 
          : "Você não receberá mais chamados de emergência",
        variant: newStatus ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error updating on-duty status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu status. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [profile, isPrestador, isOnDuty, toast]);

  return {
    isOnDuty,
    loading,
    toggleOnDuty,
    canToggle: isPrestador && !!profile
  };
};