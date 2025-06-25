
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { checkUserProfile, createUserProfile, type UserProfile } from '@/utils/database';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (authId: string) => {
    try {
      console.log('Loading profile for auth ID:', authId);
      let profileData = await checkUserProfile(authId);
      
      if (!profileData) {
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

      setProfile(profileData);
      setError(null);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
      setError('Erro ao carregar perfil do usuário');
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Verificar sessão existente primeiro
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError('Erro ao verificar sessão');
        }
        
        if (mounted) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          
          if (currentUser) {
            await loadProfile(currentUser.id);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }

        // Configurar listener de mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log('Auth state changed:', event, session?.user?.id);
            
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            
            if (currentUser && event === 'SIGNED_IN') {
              // Usar setTimeout para evitar loops infinitos
              setTimeout(async () => {
                if (mounted) {
                  await loadProfile(currentUser.id);
                }
              }, 100);
            } else if (event === 'SIGNED_OUT') {
              setProfile(null);
              setError(null);
            }
            
            if (!loading) {
              setLoading(false);
            }
          }
        );

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setError('Erro ao inicializar autenticação');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [loadProfile]);

  const logout = async () => {
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
      setLoading(false);
    }
  };

  const updateLocalProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const refreshProfile = async () => {
    if (user) {
      setLoading(true);
      await loadProfile(user.id);
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    isPrestador: profile?.tipo === 'prestador',
    isCliente: profile?.tipo === 'cliente',
    isAdmin: profile?.tipo === 'admin' || profile?.tipo === 'moderator',
    logout,
    updateLocalProfile,
    refreshProfile
  };
};
