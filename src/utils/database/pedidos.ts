
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export interface Pedido {
  id: string;
  cliente_id: string;
  prestador_id: string;
  servico_id: string;
  titulo: string;
  descricao?: string;
  preco_acordado?: number;
  status: 'pendente' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado';
  data_solicitacao: string;
  data_conclusao?: string;
  endereco_completo?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  cliente?: UserProfile;
  prestador?: UserProfile;
  servico?: {
    nome: string;
    icone?: string;
    cor?: string;
  };
}

export const getPedidos = async (userId?: string): Promise<Pedido[]> => {
  try {
    let query = supabase
      .from('pedidos')
      .select(`
        *,
        cliente:users!cliente_id(
          id, nome, email, foto_url, endereco_cidade
        ),
        prestador:users!prestador_id(
          id, nome, email, foto_url, endereco_cidade, nota_media
        ),
        servico:servicos(
          nome, icone, cor
        )
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.or(`cliente_id.eq.${userId},prestador_id.eq.${userId}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pedidos:', error);
      return [];
    }

    return (data || []) as Pedido[];
  } catch (error) {
    console.error('Error loading pedidos:', error);
    return [];
  }
};

export const createPedido = async (pedidoData: Partial<Pedido>): Promise<Pedido | null> => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .insert([{
        cliente_id: pedidoData.cliente_id,
        prestador_id: pedidoData.prestador_id,
        servico_id: pedidoData.servico_id,
        titulo: pedidoData.titulo,
        descricao: pedidoData.descricao,
        preco_acordado: pedidoData.preco_acordado,
        endereco_completo: pedidoData.endereco_completo
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating pedido:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error creating pedido:', error);
    return null;
  }
};

export const updatePedido = async (pedidoId: string, updates: Partial<Pedido>): Promise<Pedido | null> => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', pedidoId)
      .select()
      .single();

    if (error) {
      console.error('Error updating pedido:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error updating pedido:', error);
    return null;
  }
};
