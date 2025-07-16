
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getPedidos, updatePedido } from '@/utils/database/pedidos';
import { Pedido, UserProfile } from '@/utils/database/types';
import { useToast } from '@/hooks/use-toast';
import { FilterTabs } from './FilterTabs';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { PedidoCard } from './PedidoCard';

type FilterType = 'todos' | 'pendente' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado';
type StatusType = 'pendente' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado';

export const AppointmentSystem: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('todos');
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPedidos();
  }, [profile]);

  const loadPedidos = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const data = await getPedidos(profile.id);
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
  };

  const handleStatusUpdate = async (pedidoId: string, newStatus: StatusType) => {
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

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const filteredPedidos = pedidos.filter(pedido => 
    filter === 'todos' || pedido.status === filter
  );

  const isPrestador = profile?.tipo === 'prestador';
  const isMobile = window.innerWidth < 768;

  // Convert Profile to UserProfile format
  const currentUserProfile: UserProfile | null = profile ? {
    id: profile.id,
    auth_id: profile.auth_id || '', // Provide empty string if auth_id is undefined
    nome: profile.nome,
    email: profile.email,
    tipo: profile.tipo,
    bio: profile.bio,
    foto_url: profile.foto_url,
    endereco_cidade: profile.endereco_cidade,
    endereco_rua: profile.endereco_rua,
    endereco_numero: profile.endereco_numero,
    endereco_bairro: profile.endereco_bairro,
    endereco_cep: profile.endereco_cep,
    latitude: profile.latitude,
    longitude: profile.longitude,
    cpf: profile.cpf,
    nota_media: profile.nota_media,
    premium: profile.premium,
    em_servico: profile.em_servico,
    criado_em: profile.criado_em || new Date().toISOString(),
    updated_at: profile.updated_at
  } : null;

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <FilterTabs 
        filter={filter}
        onFilterChange={handleFilterChange}
        isPrestador={isPrestador}
        isMobile={isMobile}
      />

      <div className="space-y-4">
        {filteredPedidos.length === 0 ? (
          <EmptyState filter={filter} isPrestador={isPrestador} />
        ) : (
          filteredPedidos.map((pedido) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
              currentUser={currentUserProfile}
              onUpdate={loadPedidos}
            />
          ))
        )}
      </div>
    </div>
  );
};
