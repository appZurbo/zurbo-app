
import { useState, useCallback } from 'react';
import { toast } from "@/hooks/toast-system";
import { securityLogger } from '@/utils/securityLogger';
import { useAuth } from '@/hooks/useAuth';

interface MessageRateLimitConfig {
  maxMessages: number;
  windowMs: number;
  blockDurationMs: number;
}

const DEFAULT_CONFIG: MessageRateLimitConfig = {
  maxMessages: 10, // 10 mensagens
  windowMs: 60 * 1000, // por minuto
  blockDurationMs: 5 * 60 * 1000, // bloqueio de 5 minutos
};

export const useMessageRateLimit = (config: MessageRateLimitConfig = DEFAULT_CONFIG) => {
  const [messageCount, setMessageCount] = useState(0);
  const [firstMessageTime, setFirstMessageTime] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState(0);
  const { profile } = useAuth();

  const isBlocked = useCallback(() => {
    const now = Date.now();
    
    // Se ainda está bloqueado
    if (blockedUntil > now) {
      return true;
    }

    // Se passou da janela de tempo, resetar
    if (now - firstMessageTime > config.windowMs) {
      setMessageCount(0);
      setFirstMessageTime(0);
      setBlockedUntil(0);
      return false;
    }

    return false;
  }, [blockedUntil, firstMessageTime, config.windowMs]);

  const checkRateLimit = useCallback(async (): Promise<boolean> => {
    const now = Date.now();

    if (isBlocked()) {
      const remainingMinutes = Math.ceil((blockedUntil - now) / 60000);
      toast({
        title: "Limite de mensagens atingido",
        description: `Aguarde ${remainingMinutes} minutos para enviar mais mensagens`,
        variant: "destructive",
      });
      return false;
    }

    // Primeira mensagem na janela
    if (messageCount === 0) {
      setFirstMessageTime(now);
      setMessageCount(1);
      return true;
    }

    const newCount = messageCount + 1;
    setMessageCount(newCount);

    // Verificar se excedeu o limite
    if (newCount > config.maxMessages) {
      const newBlockedUntil = now + config.blockDurationMs;
      setBlockedUntil(newBlockedUntil);
      
      // Log security event
      if (profile?.id) {
        await securityLogger.logSuspiciousActivity(
          'Message rate limit exceeded',
          profile.id
        );
      }

      const remainingMinutes = Math.ceil(config.blockDurationMs / 60000);
      toast({
        title: "Muitas mensagens enviadas",
        description: `Você foi temporariamente bloqueado por ${remainingMinutes} minutos`,
        variant: "destructive",
      });
      return false;
    }

    // Avisar quando próximo do limite
    if (newCount >= config.maxMessages - 2) {
      toast({
        title: "Limite de mensagens",
        description: `Você pode enviar mais ${config.maxMessages - newCount} mensagens`,
        variant: "destructive",
      });
    }

    return true;
  }, [isBlocked, messageCount, firstMessageTime, blockedUntil, config, toast, profile]);

  const getRemainingTime = useCallback(() => {
    if (blockedUntil === 0) return 0;
    return Math.max(0, blockedUntil - Date.now());
  }, [blockedUntil]);

  return {
    checkRateLimit,
    isBlocked: isBlocked(),
    remainingTime: getRemainingTime(),
    messagesLeft: Math.max(0, config.maxMessages - messageCount)
  };
};
