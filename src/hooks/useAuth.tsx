
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { checkUserProfile, createUserProfile, type UserProfile } from '@/utils/database';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const loadProfile = async (authId: string) => {
    if (!mounted.current) return;
    
    try {
      console.log('Loading profile for auth ID:', authId);
      let profileData = await checkUserProfile(authId);
      
      if (!profileData && mounted.current) {
        console.log('Profile not found, creating new profile...');
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser && authUser.user_metadata) {
          const metadata = authUser.user_metadata;
          profileData = await createUserProfile(authId, authUser.email || '', {
            nome: metadata.nome || authUser.email?.split('@')[0] || 'Usuário',
            tipo: metadata.tipo || 'cliente',
            cpf: metadata.cpf || null
          });
        } else {
          profileData = await createUserProfile(authId, authUser?.email || '', {});
        }
      }

      if (mounted.current) {
        setProfile(profileData);
        setError(null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (mounted.current) {
        setProfile(null);
        setError('Erro ao carregar perfil do usuário');
      }
    }
  };

  useEffect(() => {
    mounted.current = true;

    const initializeAuth = async () => {
      if (!mounted.current) return;
      
      try {
        console.log('Initializing auth...');
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (mounted.current) {
            setError('Erro ao verificar sessão');
            setLoading(false);
          }
          return;
        }
        
        if (mounted.current) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          
          if (currentUser) {
            await loadProfile(currentUser.id);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted.current) {
          setError('Erro ao inicializar autenticação');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted.current) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser && event === 'SIGNED_IN') {
          await loadProfile(currentUser.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setError(null);
        }
        
        if (mounted.current) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    if (!mounted.current) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        setError('Erro ao fazer logout');
      } else {
        setUser(null);
        setProfile(null);
        setError(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError('Erro inesperado ao fazer logout');
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const updateLocalProfile = (updates: Partial<UserProfile>) => {
    if (profile && mounted.current) {
      setProfile({ ...profile, ...updates });
    }
  };

  const refreshProfile = async () => {
    if (user && mounted.current) {
      setLoading(true);
      await loadProfile(user.id);
      setLoading(false);
    }
  };

  const isAdminUser = () => {
    if (!user || !profile) return false;
    
    if (profile.tipo === 'admin' || profile.tipo === 'moderator') {
      return true;
    }
    
    const adminEmails = ['contato@zurbo.com.br', 'admin@zurbo.com.br'];
    return adminEmails.includes(user.email || '');
  };

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    isPrestador: profile?.tipo === 'prestador',
    isCliente: profile?.tipo === 'cliente',
    isAdmin: isAdminUser(),
    logout,
    updateLocalProfile,
    refreshProfile
  };
};
