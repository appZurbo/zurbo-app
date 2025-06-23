
import { supabase } from '@/integrations/supabase/client';

export interface PlanoPremium {
  id: string;
  prestador_id: string;
  ativo: boolean;
  desde: string;
  expira_em?: string;
}

export const verificarPlanoPremium = async (prestadorId?: string): Promise<PlanoPremium | null> => {
  try {
    let targetId = prestadorId;
    
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
      .from('plano_premium')
      .select('*')
      .eq('prestador_id', targetId)
      .eq('ativo', true)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar plano premium:', error);
      return null;
    }

    return data as PlanoPremium;
  } catch (error) {
    console.error('Erro ao verificar plano premium:', error);
    return null;
  }
};

export const ativarPlanoPremium = async (duracao: number = 30): Promise<boolean> => {
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
      .from('plano_premium')
      .upsert({
        prestador_id: profile.id,
        ativo: true,
        desde: new Date().toISOString(),
        expira_em: dataExpiracao.toISOString()
      });

    return !error;
  } catch (error) {
    console.error('Erro ao ativar plano premium:', error);
    return false;
  }
};
