
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  cpf: string;
  foto_perfil?: string;
  endereco?: string;
  latitude?: number;
  longitude?: number;
  descricao?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Função para carregar o perfil do usuário
    const loadProfile = async (authId: string) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', authId)
          .maybeSingle();

        if (error) {
          console.error('Error loading profile:', error);
          if (mounted) setProfile(null);
          return;
        }

        if (data && mounted) {
          setProfile(data);
        } else if (mounted) {
          console.log('No profile found for user');
          setProfile(null);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        if (mounted) setProfile(null);
      }
    };

    // Configurar listener de autenticação primeiro
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await loadProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão atual
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

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isPrestador: profile?.tipo === 'prestador',
    isCliente: profile?.tipo === 'cliente'
  };
};
