
import { useState, useEffect, useCallback } from 'react';
import { getPedidos, updatePedido } from '@/utils/database/pedidos';
import { Pedido, StatusType } from '@/types';
import { toast } from "@/hooks/use-toast";

export const usePedidos = (userId?: string) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPedidos = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await getPedidos(userId);
      setPedidos(data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const updatePedidoStatus = async (pedidoId: string, newStatus: StatusType) => {
    try {
      await updatePedido(pedidoId, { status: newStatus });
      await loadPedidos();
      
      toast({
        title: "Sucesso",
        description: "Status do pedido atualizado.",
      });
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o pedido.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadPedidos();
  }, [loadPedidos]);

  return {
    pedidos,
    loading,
    loadPedidos,
    updatePedidoStatus
  };
};
