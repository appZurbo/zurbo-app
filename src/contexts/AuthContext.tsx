
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo: 'cliente' | 'prestador' | 'admin' | 'moderator';
  foto_url?: string;
  bio?: string;
  descricao_servico?: string;
  endereco_cidade?: string;
  endereco_bairro?: string;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_cep?: string;
  cpf?: string;
  premium?: boolean;
  plano_premium?: string;
  nota_media?: number;
  em_servico?: boolean;
  latitude?: number;
  longitude?: number;
  auth_id?: string;
  updated_at?: string;
  criado_em?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isPrestador: boolean;
  isCliente: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  updateLocalProfile: (updates: Partial<Profile>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  const contextValue: AuthContextType = {
    user: auth.user,
    session: auth.session,
    profile: auth.profile,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    isPrestador: auth.isPrestador,
    isCliente: auth.isCliente,
    isAdmin: auth.isAdmin,
    logout: auth.logout,
    updateLocalProfile: auth.updateLocalProfile,
    refreshProfile: auth.refreshProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
