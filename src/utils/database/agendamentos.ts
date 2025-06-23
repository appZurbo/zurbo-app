
import { supabase } from '@/integrations/supabase/client';

export interface Agendamento {
  id: string;
  solicitante_id: string;
  prestador_id: string;
  servico_id: string;
  data_agendada: string;
  hora_agendada: string;
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
  criado_em: string;
  solicitante?: {
    nome: string;
    foto_url?: string;
    endereco_cidade?: string;
  };
  prestador?: {
    nome: string;
    foto_url?: string;
    endereco_cidade?: string;
  };
  servico?: {
    nome: string;
    icone?: string;
    cor?: string;
  };
}

export const criarAgendamento = async (dados: {
  prestadorId: string;
  servicoId: string;
  dataAgendada: string;
  horaAgendada: string;
}): Promise<Agendamento | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.user.id)
      .single();

    if (!profile) return null;

    const { data, error } = await supabase
      .from('agendamentos')
      .insert({
        solicitante_id: profile.id,
        prestador_id: dados.prestadorId,
        servico_id: dados.servicoId,
        data_agendada: dados.dataAgendada,
        hora_agendada: dados.horaAgendada,
        status: 'pendente'
      })
      .select(`
        *,
        solicitante:solicitante_id (nome, foto_url, endereco_cidade),
        prestador:prestador_id (nome, foto_url, endereco_cidade),
        servico:servico_id (nome, icone, cor)
      `)
      .single();

    if (error) {
      console.error('Erro ao criar agendamento:', error);
      return null;
    }

    return data as Agendamento;
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return null;
  }
};

export const listarAgendamentos = async (): Promise<Agendamento[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.user.id)
      .single();

    if (!profile) return [];

    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        solicitante:solicitante_id (nome, foto_url, endereco_cidade),
        prestador:prestador_id (nome, foto_url, endereco_cidade),
        servico:servico_id (nome, icone, cor)
      `)
      .or(`solicitante_id.eq.${profile.id},prestador_id.eq.${profile.id}`)
      .order('data_agendada', { ascending: true });

    if (error) {
      console.error('Erro ao listar agendamentos:', error);
      return [];
    }

    return data as Agendamento[];
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return [];
  }
};

export const atualizarStatusAgendamento = async (
  agendamentoId: string,
  novoStatus: 'confirmado' | 'concluido' | 'cancelado'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('agendamentos')
      .update({ status: novoStatus })
      .eq('id', agendamentoId);

    return !error;
  } catch (error) {
    console.error('Erro ao atualizar status do agendamento:', error);
    return false;
  }
};
