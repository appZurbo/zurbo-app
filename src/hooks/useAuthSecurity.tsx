
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthSecurityResult {
  success: boolean;
  error?: string;
  isBlocked?: boolean;
  remainingAttempts?: number;
  userCreated?: boolean;
}

export const useAuthSecurity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get the correct redirect URL based on environment
  const getRedirectUrl = () => {
    const currentUrl = window.location.origin;
    // If we're on localhost, use it for development, otherwise use production URL
    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      return currentUrl;
    }
    // For production, use the actual domain
    return 'https://zurbo.com.br';
  };

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
        return true;
      }

      return data;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true;
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
        p_ip_address: null,
        p_user_agent: navigator.userAgent
      });

      if (!success && error) {
        console.warn(`Auth attempt failed for ${email}: ${error}`);
      }
    } catch (logError) {
      console.error('Failed to log auth attempt:', logError);
    }
  }, []);

  const checkEmailAllowed = useCallback(async (email: string): Promise<boolean> => {
    try {
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

      const { data, error } = await supabase.rpc('is_email_allowed', {
        email_to_check: email
      });

      if (error) {
        console.error('Email check error:', error);
        return true;
      }

      return data;
    } catch (error) {
      console.error('Email validation failed:', error);
      return true;
    }
  }, []);

  const secureSignUp = useCallback(async (
    email: string,
    password: string,
    userData?: any
  ): Promise<AuthSecurityResult> => {
    setIsLoading(true);
    
    try {
      const canAttempt = await checkRateLimit(email, 'signup');
      if (!canAttempt) {
        await logAuthAttempt(email, 'signup', false, 'Rate limit exceeded');
        return {
          success: false,
          error: 'Muitas tentativas de registro. Tente novamente em 24 horas.',
          isBlocked: true
        };
      }

      const emailAllowed = await checkEmailAllowed(email);
      if (!emailAllowed) {
        await logAuthAttempt(email, 'signup', false, 'Blocked email domain');
        return {
          success: false,
          error: 'Este domínio de email não é permitido. Use um email válido.'
        };
      }

      const redirectUrl = getRedirectUrl();
      console.log('Using redirect URL for signup:', redirectUrl);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      // Verificar se o usuário foi criado mesmo quando há erro (ex: erro no envio de email)
      if (error) {
        // Se o usuário foi criado mas há erro (provavelmente no envio de email), permitir continuar
        if (data?.user) {
          await logAuthAttempt(email, 'signup', true);
          return {
            success: true,
            userCreated: true,
            error: error.message // Avisar sobre o erro mas permitir continuar
          };
        }
        
        await logAuthAttempt(email, 'signup', false, error.message);
        return {
          success: false,
          error: error.message
        };
      }

      await logAuthAttempt(email, 'signup', true);
      
      return {
        success: true,
        userCreated: true
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
      const canAttempt = await checkRateLimit(email, 'login');
      if (!canAttempt) {
        await logAuthAttempt(email, 'login', false, 'Rate limit exceeded');
        return {
          success: false,
          error: 'Muitas tentativas de login falharam. Tente novamente em 1 hora.',
          isBlocked: true
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        await logAuthAttempt(email, 'login', false, error.message);
        
        // Check if it's an email confirmation error
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          return {
            success: false,
            error: 'Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada e clique no link de confirmação.'
          };
        }
        
        return {
          success: false,
          error: error.message
        };
      }

      // Enhanced email confirmation check
      if (data.user && !data.user.email_confirmed_at) {
        await logAuthAttempt(email, 'login', false, 'Email not confirmed');
        
        // Force sign out the unconfirmed user
        await supabase.auth.signOut();
        
        return {
          success: false,
          error: 'Seu email ainda não foi confirmado. Por favor, verifique sua caixa de entrada e clique no link de confirmação antes de tentar fazer login novamente.'
        };
      }

      // Additional check to ensure user is properly authenticated
      if (!data.session || !data.session.access_token) {
        await logAuthAttempt(email, 'login', false, 'Invalid session');
        return {
          success: false,
          error: 'Falha na autenticação. Tente novamente.'
        };
      }

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

      const redirectUrl = getRedirectUrl();
      console.log('Using redirect URL for email confirmation:', redirectUrl);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectUrl
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
