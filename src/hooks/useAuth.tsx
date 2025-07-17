import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isPrestador: boolean;
  isCliente: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateLocalProfile: (updates: Partial<UserProfile>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isPrestador: false,
  isCliente: false,
  isAdmin: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  logout: async () => {},
  updateLocalProfile: () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setError(error.message);
        return null;
      }

      const profileData: UserProfile = {
        ...data,
        auth_id: data.auth_id || userId,
        criado_em: data.criado_em || new Date().toISOString(),
        tipo: data.tipo as 'cliente' | 'prestador' | 'admin' | 'moderator'
      };

      return profileData;
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError(error.message);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await loadProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        setError(null);

        if (session?.user) {
          setTimeout(async () => {
            if (isMounted) {
              const userProfile = await loadProfile(session.user.id);
              if (isMounted && userProfile) {
                setProfile(userProfile);
              }
            }
          }, 0);
        } else {
          setProfile(null);
        }

        if (isMounted) {
          setLoading(false);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
          return;
        }

        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const userProfile = await loadProfile(session.user.id);
          if (isMounted && userProfile) {
            setProfile(userProfile);
          }
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        setError(error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      setError('Erro ao fazer login');
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      setError(null);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) return { error };

      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            auth_id: data.user.id,
            email: email,
            nome: userData.nome || '',
            tipo: userData.tipo || 'cliente',
            bio: userData.bio || '',
            endereco_cidade: userData.endereco_cidade || '',
            endereco_bairro: userData.endereco_bairro || '',
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          setError(profileError.message);
          return { error: profileError };
        }
      }

      return { error: null };
    } catch (error: any) {
      setError('Erro ao criar conta');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error: any) {
      setError('Erro ao sair');
      console.error('Error signing out:', error);
    }
  };

  const logout = signOut;

  const updateLocalProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const isAuthenticated = !!user;
  const isPrestador = profile?.tipo === 'prestador';
  const isCliente = profile?.tipo === 'cliente';
  const isAdmin = profile?.tipo === 'admin' || profile?.tipo === 'moderator';

  const value = {
    user,
    session,
    profile,
    loading,
    error,
    isAuthenticated,
    isPrestador,
    isCliente,
    isAdmin,
    signIn,
    signUp,
    signOut,
    logout,
    updateLocalProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
