
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { checkUserProfile, createUserProfile, type UserProfile } from '@/utils/database';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async (authId: string) => {
      try {
        console.log('Loading profile for auth ID:', authId);
        let profileData = await checkUserProfile(authId);
        
        if (!profileData && mounted) {
          console.log('Profile not found, creating new profile...');
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            profileData = await createUserProfile(authId, authUser.email || '', {});
            console.log('Created new profile:', profileData);
          }
        }

        if (mounted) {
          console.log('Setting profile:', profileData);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        if (mounted) setProfile(null);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          setTimeout(() => {
            if (mounted) {
              loadProfile(currentUser.id);
            }
          }, 100);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await loadProfile(currentUser.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateLocalProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isPrestador: profile?.tipo === 'prestador',
    isCliente: profile?.tipo === 'cliente',
    isAdmin: profile?.tipo === 'admin' || profile?.tipo === 'moderator',
    logout,
    updateLocalProfile
  };
};
