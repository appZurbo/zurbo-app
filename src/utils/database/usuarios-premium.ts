
import { supabase } from '@/integrations/supabase/client';

export interface UsuarioPremium {
  id: string;
  usuario_id: string;
  ativo: boolean;
  desde: string;
  expira_em?: string;
}

export const verificarUsuarioPremium = async (usuarioId?: string): Promise<UsuarioPremium | null> => {
  try {
    let targetId = usuarioId;
    
    if (!targetId) {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.user.id)
        .single();

      if (!profile) return null;
      targetId = profile.id;
    }

    const { data, error } = await supabase
      .from('usuarios_premium')
      .select('*')
      .eq('usuario_id', targetId)
      .eq('ativo', true)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar usuário premium:', error);
      return null;
    }

    return data as UsuarioPremium;
  } catch (error) {
    console.error('Erro ao verificar usuário premium:', error);
    return null;
  }
};

export const ativarUsuarioPremium = async (duracao: number = 30): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.user.id)
      .single();

    if (!profile) return false;

    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + duracao);

    const { error } = await supabase
      .from('usuarios_premium')
      .upsert({
        usuario_id: profile.id,
        ativo: true,
        desde: new Date().toISOString(),
        expira_em: dataExpiracao.toISOString()
      });

    return !error;
  } catch (error) {
    console.error('Erro ao ativar usuário premium:', error);
    return false;
  }
};
