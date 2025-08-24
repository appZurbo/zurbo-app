
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuthSecurityResult {
  success: boolean;
  error?: string;
  data?: any;
}

export const useAuthSecurity = () => {
  const [isLoading, setIsLoading] = useState(false);

  const secureSignUp = async (email: string, password: string, userData?: any): Promise<AuthSecurityResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const secureSignIn = async (email: string, password: string): Promise<AuthSecurityResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<AuthSecurityResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<AuthSecurityResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const validateSession = async (): Promise<AuthSecurityResult> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Session validation error:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshSession = async (): Promise<AuthSecurityResult> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Session refresh error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    secureSignUp,
    secureSignIn,
    signOut,
    resetPassword,
    validateSession,
    refreshSession,
    isLoading
  };
};
