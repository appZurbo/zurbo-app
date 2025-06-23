
import { supabase } from '@/integrations/supabase/client';

export interface BairroAtendido {
  id: string;
  prestador_id: string;
  bairro: string;
}

export const BAIRROS_SINOP = [
  'Centro',
  'Jardim Botânico',
  'Jardim Primaveras',
  'Menino Jesus',
  'Boa Esperança',
  'Residencial Jequitibás',
  'Aquarela Brasil',
  'Residencial Daury Riva',
  'São Cristóvão',
  'Jardim Violetas',
  'Jardim Maringá',
  'Residencial América',
  'Maria Carolina',
  'Jardim Florença'
];

export const listarBairrosAtendidos = async (prestadorId?: string): Promise<BairroAtendido[]> => {
  try {
    let targetId = prestadorId;
    
    if (!targetId) {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.user.id)
        .single();

      if (!profile) return [];
      targetId = profile.id;
    }

    const { data, error } = await supabase
      .from('bairros_atendidos')
      .select('*')
      .eq('prestador_id', targetId);

    if (error) {
      console.error('Erro ao listar bairros atendidos:', error);
      return [];
    }

    return data as BairroAtendido[];
  } catch (error) {
    console.error('Erro ao listar bairros atendidos:', error);
    return [];
  }
};

export const adicionarBairroAtendido = async (bairro: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.user.id)
      .single();

    if (!profile) return false;

    const { error } = await supabase
      .from('bairros_atendidos')
      .insert({
        prestador_id: profile.id,
        bairro: bairro
      });

    return !error;
  } catch (error) {
    console.error('Erro ao adicionar bairro:', error);
    return false;
  }
};

export const removerBairroAtendido = async (bairroId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bairros_atendidos')
      .delete()
      .eq('id', bairroId);

    return !error;
  } catch (error) {
    console.error('Erro ao remover bairro:', error);
    return false;
  }
};
