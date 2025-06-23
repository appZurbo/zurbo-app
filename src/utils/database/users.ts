
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const checkUserProfile = async (authId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .maybeSingle();

    if (error) {
      console.error('Error checking user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Database check error:', error);
    return null;
  }
};

export const createUserProfile = async (authId: string, email: string, userData: any): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        auth_id: authId,
        email: email,
        nome: userData.nome || email.split('@')[0],
        tipo: userData.tipo || 'cliente',
        cpf: userData.cpf || null,
        endereco_cidade: userData.endereco_cidade || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Profile creation error:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Profile update error:', error);
    return null;
  }
};
