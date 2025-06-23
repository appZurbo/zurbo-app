
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
    // Usar SQL direto já que a tabela pedidos não está nos tipos gerados
    let query = `
      SELECT 
        p.*,
        row_to_json(c.*) as cliente,
        row_to_json(pr.*) as prestador,
        row_to_json(s.*) as servico
      FROM pedidos p
      LEFT JOIN users c ON p.cliente_id = c.id
      LEFT JOIN users pr ON p.prestador_id = pr.id
      LEFT JOIN servicos s ON p.servico_id = s.id
    `;
    
    if (userId) {
      query += ` WHERE p.cliente_id = '${userId}' OR p.prestador_id = '${userId}'`;
    }
    
    query += ` ORDER BY p.created_at DESC`;

    const { data, error } = await supabase.rpc('execute_sql', { query });

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
    const query = `
      INSERT INTO pedidos (cliente_id, prestador_id, servico_id, titulo, descricao, preco_acordado, endereco_completo)
      VALUES ('${pedidoData.cliente_id}', '${pedidoData.prestador_id}', '${pedidoData.servico_id}', '${pedidoData.titulo}', '${pedidoData.descricao}', ${pedidoData.preco_acordado}, '${pedidoData.endereco_completo}')
      RETURNING *
    `;

    const { data, error } = await supabase.rpc('execute_sql', { query });

    if (error) {
      console.error('Error creating pedido:', error);
      return null;
    }

    return (data?.[0] || null) as Pedido;
  } catch (error) {
    console.error('Error creating pedido:', error);
    return null;
  }
};

export const updatePedido = async (pedidoId: string, updates: Partial<Pedido>): Promise<Pedido | null> => {
  try {
    const setClause = Object.entries(updates)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(', ');

    const query = `
      UPDATE pedidos 
      SET ${setClause}, updated_at = NOW()
      WHERE id = '${pedidoId}'
      RETURNING *
    `;

    const { data, error } = await supabase.rpc('execute_sql', { query });

    if (error) {
      console.error('Error updating pedido:', error);
      return null;
    }

    return (data?.[0] || null) as Pedido;
  } catch (error) {
    console.error('Error updating pedido:', error);
    return null;
  }
};
