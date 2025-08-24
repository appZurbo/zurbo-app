// Hook-free authentication provider to avoid React useState errors
import React, { createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "@/utils/toast";

interface Profile {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  foto_url: string;
  is_prestador: boolean;
  is_admin: boolean;
  cidade: string;
  estado: string;
  bio: string;
  tipo: "cliente" | "prestador" | "admin" | "moderator";
  auth_id: string;
  criado_em: string;
  premium?: boolean;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_cep?: string;
  cpf?: string;
  em_servico?: boolean;
  portfolio_fotos?: any;
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  session: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  isPrestador: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  register: (email: string, password: string, nome?: string | any, telefone?: string | any) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, nome?: string | any, telefone?: string | any) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateLocalProfile?: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple authentication provider without React hooks
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock auth state - this should work without React hooks causing issues
  const mockAuthState = {
    user: null,
    profile: null,
    session: null,
    isAuthenticated: false,
    loading: false,
    isPrestador: false,
    isAdmin: false
  };

  const login = async (email: string, password: string) => {
    console.log('Login attempt:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error:", error.message);
        toast.error(error.message || 'Credenciais inválidas.');
        return { error };
      }

      toast.success('Login realizado com sucesso!');
      window.location.href = '/';
      return { error: null };
    } catch (error) {
      console.error("Login exception:", error);
      toast.error('Por favor, tente novamente.');
      return { error };
    }
  };

  const register = async (email: string, password: string, nome: string | any = '', telefone: string | any = '') => {
    console.log('Register attempt:', email);
    try {
      const nomeStr = typeof nome === 'string' ? nome : (nome?.nome || '');
      const telefoneStr = typeof telefone === 'string' ? telefone : (telefone?.telefone || '');
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            nome: nomeStr,
            telefone: telefoneStr,
          },
        },
      });

      if (error) {
        console.error("Register error:", error.message);
        toast.error(error.message || 'Por favor, tente novamente.');
        return { error };
      }

      if (data.user?.id) {
        await supabase.from('users').insert([
          {
            id: data.user.id,
            auth_id: data.user.id,
            nome: nomeStr,
            email: email,
            foto_url: '',
            tipo: 'cliente',
            endereco_cidade: '',
            bio: '',
          },
        ]);
      }

      toast.success('Sua conta foi criada com sucesso!');
      window.location.href = '/';
      return { error: null };
    } catch (error) {
      console.error("Register exception:", error);
      toast.error('Por favor, tente novamente mais tarde.');
      return { error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logout realizado com sucesso!');
      window.location.href = '/auth';
    } catch (error) {
      console.error("Logout error:", error);
      toast.error('Erro ao fazer logout');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    console.log('Profile update requested:', updates);
    // Mock implementation
  };

  const refreshProfile = async () => {
    console.log('Profile refresh requested');
    // Mock implementation
  };

  const contextValue: AuthContextType = {
    ...mockAuthState,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
    signIn: login,
    signUp: register,
    signOut: logout,
    updateLocalProfile: updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};