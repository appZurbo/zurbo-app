
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { checkUserProfile, createUserProfile, type UserProfile } from '@/utils/database';
import { securityLogger } from '@/utils/securityLogger';
import type { User } from '@supabase/supabase-js';

export const useImprovedAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUserProfile = async (authId: string) => {
      try {
        console.log('Loading profile for auth ID:', authId);
        let profileData = await checkUserProfile(authId);
        
        if (!profileData && mounted) {
          console.log('Profile not found, attempting to create...');
          
          // Get user metadata from auth
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser && authUser.user_metadata) {
            const metadata = authUser.user_metadata;
            profileData = await createUserProfile(authId, authUser.email || '', {
              nome: metadata.nome || authUser.email?.split('@')[0] || 'Usuário',
              tipo: metadata.tipo || 'cliente',
              cpf: metadata.cpf || null
            });
            
            if (profileData) {
              console.log('Profile created successfully:', profileData);
              await securityLogger.logEvent({
                event_type: 'profile_update',
                user_id: authId,
                details: { action: 'profile_created_from_metadata' },
                severity: 'low'
              });
            }
          }
        }

        if (mounted) {
          setProfile(profileData);
          setError(null);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        if (mounted) {
          setProfile(null);
          setError('Erro ao carregar perfil do usuário');
        }
      }
    };

    const initializeAuth = async () => {
      try {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log('Auth state changed:', event, session?.user?.id);
            
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            
            if (currentUser) {
              // Delay profile loading to ensure auth state is fully settled
              setTimeout(() => {
                if (mounted) {
                  loadUserProfile(currentUser.id);
                }
              }, 100);
            } else {
              setProfile(null);
              setError(null);
            }
            
            if (event === 'SIGNED_IN') {
              setLoading(false);
            }
          }
        );

        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError('Erro ao verificar sessão');
        }
        
        if (!mounted) return;
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await loadUserProfile(currentUser.id);
        } else {
          setProfile(null);
        }

        setLoading(false);

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
  }, []);

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
      await loadUserProfile(user.id);
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
