
import { supabase } from '@/integrations/supabase/client';

export const checkUserProfile = async (authId: string) => {
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

    return data;
  } catch (error) {
    console.error('Database check error:', error);
    return null;
  }
};

export const createUserProfile = async (authId: string, email: string, userData: any) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        auth_id: authId,
        email: email,
        nome: userData.nome || email.split('@')[0],
        tipo: userData.tipo || 'cliente',
        cpf: userData.cpf || '',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Profile creation error:', error);
    return null;
  }
};
