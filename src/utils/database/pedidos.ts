
import { supabase } from '@/integrations/supabase/client';
import { Pedido } from './types';

export const getPedidos = async (userId?: string): Promise<Pedido[]> => {
  try {
    let query = supabase
      .from('pedidos')
      .select(`
        *,
        cliente:users!pedidos_cliente_id_fkey (nome, foto_url, email),
        prestador:users!pedidos_prestador_id_fkey (nome, foto_url, email),
        servico:servicos (nome, icone, cor)
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
      .insert(pedidoData)
      .select(`
        *,
        cliente:users!pedidos_cliente_id_fkey (nome, foto_url, email),
        prestador:users!pedidos_prestador_id_fkey (nome, foto_url, email),
        servico:servicos (nome, icone, cor)
      `)
      .single();

    if (error) {
      console.error('Error creating pedido:', error);
      return null;
    }

    return data as Pedido;
  } catch (error) {
    console.error('Error creating pedido:', error);
    return null;
  }
};

export const updatePedido = async (pedidoId: string, updates: Partial<Pedido>): Promise<Pedido | null> => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .update(updates)
      .eq('id', pedidoId)
      .select(`
        *,
        cliente:users!pedidos_cliente_id_fkey (nome, foto_url, email),
        prestador:users!pedidos_prestador_id_fkey (nome, foto_url, email),
        servico:servicos (nome, icone, cor)
      `)
      .single();

    if (error) {
      console.error('Error updating pedido:', error);
      return null;
    }

    return data as Pedido;
  } catch (error) {
    console.error('Error updating pedido:', error);
    return null;
  }
};
