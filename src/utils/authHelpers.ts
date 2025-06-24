
import { supabase } from '@/integrations/supabase/client';
import { validateEmail, sanitizeText } from './validation';
import { securityLogger } from './securityLogger';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: any;
  needsEmailConfirmation?: boolean;
}

export const secureSignUp = async (
  email: string,
  password: string,
  userData: {
    nome: string;
    cpf: string;
    tipo: string;
  }
): Promise<AuthResult> => {
  try {
    // Validação prévia
    if (!validateEmail(email)) {
      return { success: false, error: 'Email inválido' };
    }

    const cleanEmail = sanitizeText(email.toLowerCase());
    const cleanName = sanitizeText(userData.nome);
    const cleanCPF = userData.cpf.replace(/\D/g, '');

    // Verificar se usuário já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingUser) {
      return { success: false, error: 'Email já cadastrado' };
    }

    // Criar conta
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          nome: cleanName,
          cpf: cleanCPF,
          tipo: userData.tipo
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      await securityLogger.logEvent({
        event_type: 'account_creation',
        details: { 
          email: cleanEmail, 
          success: false, 
          error: error.message,
          tipo: userData.tipo 
        },
        severity: 'medium'
      });
      return { success: false, error: error.message };
    }

    if (data.user) {
      await securityLogger.logEvent({
        event_type: 'account_creation',
        user_id: data.user.id,
        details: { 
          email: cleanEmail, 
          success: true,
          tipo: userData.tipo 
        },
        severity: 'low'
      });

      return { 
        success: true, 
        user: data.user,
        needsEmailConfirmation: !data.user.email_confirmed_at 
      };
    }

    return { success: false, error: 'Erro desconhecido no cadastro' };
  } catch (error: any) {
    console.error('Secure signup error:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
};

export const secureSignIn = async (email: string, password: string): Promise<AuthResult> => {
  try {
    if (!validateEmail(email)) {
      return { success: false, error: 'Email inválido' };
    }

    const cleanEmail = sanitizeText(email.toLowerCase());

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      await securityLogger.logLoginAttempt(cleanEmail, false);
      return { success: false, error: error.message };
    }

    if (data.user) {
      await securityLogger.logLoginAttempt(cleanEmail, true, data.user.id);
      return { success: true, user: data.user };
    }

    return { success: false, error: 'Erro desconhecido no login' };
  } catch (error: any) {
    console.error('Secure signin error:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
};

export const checkEmailConfirmation = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return false;
    
    return !!data.user.email_confirmed_at;
  } catch (error) {
    console.error('Error checking email confirmation:', error);
    return false;
  }
};

export const resendConfirmationEmail = async (email: string): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: sanitizeText(email.toLowerCase())
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error resending confirmation email:', error);
    return { success: false, error: 'Erro ao reenviar email de confirmação' };
  }
};
