import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  foto_url: string;
  is_prestador: boolean;
  is_admin: boolean;
  location: {
    latitude: number | null;
    longitude: number | null;
  };
  cidade: string | null;
  estado: string | null;
  bio: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  isPrestador: boolean;
  isAdmin: boolean;
  login: (email: string) => Promise<void>;
  register: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPrestador, setIsPrestador] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      await loadProfile(session?.user?.id);
      setLoading(false);
    };

    loadSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      await loadProfile(session?.user?.id);
    });
  }, []);

  const loadProfile = async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      setIsPrestador(false);
      setIsAdmin(false);
      return;
    }

    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Erro ao carregar o perfil:", error);
        setProfile(null);
        setIsPrestador(false);
        setIsAdmin(false);
        return;
      }

      if (profileData) {
        const typedProfile: Profile = {
          id: profileData.id,
          nome: profileData.nome,
          email: profileData.email,
          telefone: profileData.telefone,
          foto_url: profileData.foto_url,
          is_prestador: profileData.is_prestador,
          is_admin: profileData.is_admin,
          location: {
            latitude: profileData.location?.latitude ?? null,
            longitude: profileData.location?.longitude ?? null,
          },
          cidade: profileData.cidade,
          estado: profileData.estado,
          bio: profileData.bio,
          website: profileData.website,
          instagram: profileData.instagram,
          facebook: profileData.facebook,
          twitter: profileData.twitter,
        };

        setProfile(typedProfile);
        setIsPrestador(profileData.is_prestador || false);
        setIsAdmin(profileData.is_admin || false);
      } else {
        setProfile(null);
        setIsPrestador(false);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Erro ao buscar o perfil:", err);
      setProfile(null);
      setIsPrestador(false);
      setIsAdmin(false);
    }
  };

  const login = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
    } catch (error: any) {
      console.error("Erro ao fazer login:", error.message);
    }
  };

  const register = async (email: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, });
      if (error) throw error;
    } catch (error: any) {
      console.error("Erro ao registrar:", error.message);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
      setIsPrestador(false);
      setIsAdmin(false);
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error.message);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) {
      console.error("Usuário não autenticado.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select('*')
        .single();

      if (error) {
        console.error("Erro ao atualizar o perfil:", error);
        return;
      }

      // Transformar os dados antes de atualizar o estado
      const updatedProfile: Profile = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        foto_url: data.foto_url,
        is_prestador: data.is_prestador,
        is_admin: data.is_admin,
        location: {
          latitude: data.location?.latitude ?? null,
          longitude: data.location?.longitude ?? null,
        },
        cidade: data.cidade,
        estado: data.estado,
        bio: data.bio,
        website: data.website,
        instagram: data.instagram,
        facebook: data.facebook,
        twitter: data.twitter,
      };

      setProfile(updatedProfile);
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      isAuthenticated,
      loading,
      isPrestador,
      isAdmin,
      login,
      register,
      logout,
      updateProfile,
      refreshProfile
    }}>
      {children}
      {/* Removed Toaster from here - avoiding duplicate toast systems */}
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
