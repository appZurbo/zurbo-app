import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthSecurityResult {
  success: boolean;
  error?: string;
  isBlocked?: boolean;
  remainingAttempts?: number;
}

export const useAuthSecurity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const checkRateLimit = useCallback(async (
    email: string, 
    attemptType: 'login' | 'signup' | 'password_reset'
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_email: email,
        p_attempt_type: attemptType,
        p_max_attempts: attemptType === 'login' ? 5 : 3,
        p_time_window: attemptType === 'login' ? '1 hour' : '24 hours'
      });

      if (error) {
        console.error('Rate limit check error:', error);
        return true; // Em caso de erro, permitir tentativa
      }

      return data;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Em caso de erro, permitir tentativa
    }
  }, []);

  const logAuthAttempt = useCallback(async (
    email: string,
    attemptType: 'login' | 'signup' | 'password_reset',
    success: boolean,
    error?: string
  ) => {
    try {
      await supabase.rpc('log_auth_attempt', {
        p_email: email,
        p_attempt_type: attemptType,
        p_success: success,
        p_ip_address: null, // Browser não tem acesso ao IP real
        p_user_agent: navigator.userAgent
      });

      // Log adicional para auditoria se necessário
      if (!success && error) {
        console.warn(`Auth attempt failed for ${email}: ${error}`);
      }
    } catch (logError) {
      console.error('Failed to log auth attempt:', logError);
      // Não falhar a autenticação por causa do log
    }
  }, []);

  const checkEmailAllowed = useCallback(async (email: string): Promise<boolean> => {
    try {
      // Verificar se é um email temporário conhecido
      const tempEmailPatterns = [
        '10minutemail', 'guerrillamail', 'mailinator', 'tempmail', 
        'throwaway', 'disposable', 'temp-mail', 'fake'
      ];
      
      const isTemporary = tempEmailPatterns.some(pattern => 
        email.toLowerCase().includes(pattern)
      );

      if (isTemporary) {
        return false;
      }

      // Verificar na base de dados
      const { data, error } = await supabase.rpc('is_email_allowed', {
        email_to_check: email
      });

      if (error) {
        console.error('Email check error:', error);
        return true; // Em caso de erro, permitir
      }

      return data;
    } catch (error) {
      console.error('Email validation failed:', error);
      return true; // Em caso de erro, permitir
    }
  }, []);

  const secureSignUp = useCallback(async (
    email: string,
    password: string,
    userData?: any
  ): Promise<AuthSecurityResult> => {
    setIsLoading(true);
    
    try {
      // 1. Verificar rate limiting
      const canAttempt = await checkRateLimit(email, 'signup');
      if (!canAttempt) {
        await logAuthAttempt(email, 'signup', false, 'Rate limit exceeded');
        return {
          success: false,
          error: 'Muitas tentativas de registro. Tente novamente em 24 horas.',
          isBlocked: true
        };
      }

      // 2. Verificar se email é permitido
      const emailAllowed = await checkEmailAllowed(email);
      if (!emailAllowed) {
        await logAuthAttempt(email, 'signup', false, 'Blocked email domain');
        return {
          success: false,
          error: 'Este domínio de email não é permitido. Use um email válido.'
        };
      }

      // 3. Tentar registrar
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData
        }
      });

      if (error) {
        await logAuthAttempt(email, 'signup', false, error.message);
        return {
          success: false,
          error: error.message
        };
      }

      // 4. Log sucesso
      await logAuthAttempt(email, 'signup', true);
      
      return {
        success: true
      };

    } catch (error: any) {
      await logAuthAttempt(email, 'signup', false, error.message);
      return {
        success: false,
        error: error.message || 'Erro interno do servidor'
      };
    } finally {
      setIsLoading(false);
    }
  }, [checkRateLimit, checkEmailAllowed, logAuthAttempt]);

  const secureSignIn = useCallback(async (
    email: string,
    password: string
  ): Promise<AuthSecurityResult> => {
    setIsLoading(true);

    try {
      // 1. Verificar rate limiting
      const canAttempt = await checkRateLimit(email, 'login');
      if (!canAttempt) {
        await logAuthAttempt(email, 'login', false, 'Rate limit exceeded');
        return {
          success: false,
          error: 'Muitas tentativas de login falharam. Tente novamente em 1 hora.',
          isBlocked: true
        };
      }

      // 2. Tentar fazer login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        await logAuthAttempt(email, 'login', false, error.message);
        return {
          success: false,
          error: error.message
        };
      }

      // 3. Verificar se email foi confirmado
      if (data.user && !data.user.email_confirmed_at) {
        await logAuthAttempt(email, 'login', false, 'Email not confirmed');
        
        // Fazer logout do usuário não confirmado
        await supabase.auth.signOut();
        
        return {
          success: false,
          error: 'Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.'
        };
      }

      // 4. Log sucesso
      await logAuthAttempt(email, 'login', true);
      
      return {
        success: true
      };

    } catch (error: any) {
      await logAuthAttempt(email, 'login', false, error.message);
      return {
        success: false,
        error: error.message || 'Erro interno do servidor'
      };
    } finally {
      setIsLoading(false);
    }
  }, [checkRateLimit, logAuthAttempt]);

  const resendConfirmation = useCallback(async (email: string): Promise<AuthSecurityResult> => {
    setIsLoading(true);

    try {
      const canAttempt = await checkRateLimit(email, 'password_reset');
      if (!canAttempt) {
        return {
          success: false,
          error: 'Muitas tentativas de reenvio. Tente novamente em 24 horas.',
          isBlocked: true
        };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      toast({
        title: "Email reenviado",
        description: "Verifique sua caixa de entrada para confirmar sua conta.",
      });

      return {
        success: true
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao reenviar email'
      };
    } finally {
      setIsLoading(false);
    }
  }, [checkRateLimit, toast]);

  return {
    secureSignUp,
    secureSignIn,
    resendConfirmation,
    checkRateLimit,
    checkEmailAllowed,
    logAuthAttempt,
    isLoading
  };
};