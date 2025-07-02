
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface UsageLimits {
  id: string;
  user_id: string;
  service_requests_hour: number;
  service_requests_day: number;
  active_requests: number;
  last_request_at?: string;
  blocked_until?: string;
}

export const useUsageLimits = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const checkLimits = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { data: limits } = await supabase
        .from('usage_limits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const now = new Date();
      
      // Verificar se está bloqueado
      if (limits?.blocked_until && new Date(limits.blocked_until) > now) {
        const blockedUntil = new Date(limits.blocked_until);
        toast({
          title: "Limite Excedido",
          description: `Você atingiu o limite de solicitações. Tente novamente em ${blockedUntil.toLocaleString()}`,
          variant: "destructive"
        });
        return false;
      }

      // Verificar limite por hora (máx 3)
      if (limits?.service_requests_hour >= 3) {
        const lastRequest = new Date(limits.last_request_at || 0);
        const hoursSince = (now.getTime() - lastRequest.getTime()) / (1000 * 60 * 60);
        
        if (hoursSince < 1) {
          // Bloquear por 6 horas
          const blockUntil = new Date(now.getTime() + 6 * 60 * 60 * 1000);
          await supabase
            .from('usage_limits')
            .upsert({
              user_id: user.id,
              blocked_until: blockUntil.toISOString(),
              service_requests_hour: 0
            });
          
          toast({
            title: "Limite Excedido",
            description: "Máximo de 3 solicitações por hora. Bloqueado por 6 horas.",
            variant: "destructive"
          });
          return false;
        }
      }

      // Verificar limite por dia (máx 10)
      if (limits?.service_requests_day >= 10) {
        const lastRequest = new Date(limits.last_request_at || 0);
        const daysSince = (now.getTime() - lastRequest.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSince < 1) {
          // Bloquear por 24 horas
          const blockUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          await supabase
            .from('usage_limits')
            .upsert({
              user_id: user.id,
              blocked_until: blockUntil.toISOString(),
              service_requests_day: 0
            });
          
          toast({
            title: "Limite Excedido",
            description: "Máximo de 10 solicitações por dia. Bloqueado por 24 horas.",
            variant: "destructive"
          });
          return false;
        }
      }

      // Verificar limite de pedidos ativos (máx 5)
      if (limits?.active_requests >= 5) {
        toast({
          title: "Limite Excedido",
          description: "Máximo de 5 solicitações ativas simultâneas.",
          variant: "destructive"
        });
        return false;
      }

      // Verificar delay mínimo (10 min)
      if (limits?.last_request_at) {
        const lastRequest = new Date(limits.last_request_at);
        const minutesSince = (now.getTime() - lastRequest.getTime()) / (1000 * 60);
        
        if (minutesSince < 10) {
          toast({
            title: "Aguarde",
            description: `Aguarde ${Math.ceil(10 - minutesSince)} minutos entre solicitações.`,
            variant: "destructive"
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking limits:', error);
      return true; // Em caso de erro, permitir (fail-safe)
    }
  }, [user?.id, toast]);

  const recordRequest = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: limits } = await supabase
        .from('usage_limits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const now = new Date();
      const lastRequest = limits?.last_request_at ? new Date(limits.last_request_at) : new Date(0);
      
      // Reset counters if more than 1 hour/day has passed
      const hoursSince = (now.getTime() - lastRequest.getTime()) / (1000 * 60 * 60);
      const daysSince = (now.getTime() - lastRequest.getTime()) / (1000 * 60 * 60 * 24);
      
      const newHourCount = hoursSince >= 1 ? 1 : (limits?.service_requests_hour || 0) + 1;
      const newDayCount = daysSince >= 1 ? 1 : (limits?.service_requests_day || 0) + 1;

      await supabase
        .from('usage_limits')
        .upsert({
          user_id: user.id,
          service_requests_hour: newHourCount,
          service_requests_day: newDayCount,
          active_requests: (limits?.active_requests || 0) + 1,
          last_request_at: now.toISOString()
        });

    } catch (error) {
      console.error('Error recording request:', error);
    }
  }, [user?.id]);

  const releaseActiveRequest = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: limits } = await supabase
        .from('usage_limits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (limits && limits.active_requests > 0) {
        await supabase
          .from('usage_limits')
          .update({
            active_requests: limits.active_requests - 1
          })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error releasing active request:', error);
    }
  }, [user?.id]);

  return {
    loading,
    checkLimits,
    recordRequest,
    releaseActiveRequest
  };
};
