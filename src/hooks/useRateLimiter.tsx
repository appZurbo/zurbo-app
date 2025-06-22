
import { useState, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitState {
  attempts: number;
  firstAttempt: number;
  blockedUntil: number;
}

export const useRateLimiter = (key: string, config: RateLimitConfig) => {
  const [state, setState] = useState<RateLimitState>(() => {
    const stored = localStorage.getItem(`rateLimit_${key}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { attempts: 0, firstAttempt: 0, blockedUntil: 0 };
      }
    }
    return { attempts: 0, firstAttempt: 0, blockedUntil: 0 };
  });

  const isBlocked = useCallback(() => {
    const now = Date.now();
    
    // Se ainda está bloqueado
    if (state.blockedUntil > now) {
      return true;
    }

    // Se passou da janela de tempo, resetar
    if (now - state.firstAttempt > config.windowMs) {
      const newState = { attempts: 0, firstAttempt: 0, blockedUntil: 0 };
      setState(newState);
      localStorage.setItem(`rateLimit_${key}`, JSON.stringify(newState));
      return false;
    }

    return false;
  }, [state, config, key]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    const newAttempts = state.attempts + 1;
    const firstAttempt = state.firstAttempt || now;

    let blockedUntil = state.blockedUntil;
    
    if (newAttempts >= config.maxAttempts) {
      blockedUntil = now + config.blockDurationMs;
    }

    const newState = {
      attempts: newAttempts,
      firstAttempt,
      blockedUntil
    };

    setState(newState);
    localStorage.setItem(`rateLimit_${key}`, JSON.stringify(newState));
  }, [state, config, key]);

  const reset = useCallback(() => {
    const newState = { attempts: 0, firstAttempt: 0, blockedUntil: 0 };
    setState(newState);
    localStorage.setItem(`rateLimit_${key}`, JSON.stringify(newState));
  }, [key]);

  const getRemainingTime = useCallback(() => {
    if (state.blockedUntil === 0) return 0;
    return Math.max(0, state.blockedUntil - Date.now());
  }, [state.blockedUntil]);

  return {
    isBlocked: isBlocked(),
    recordAttempt,
    reset,
    remainingTime: getRemainingTime(),
    attempts: state.attempts
  };
};
