
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePedidos } from '@/hooks/usePedidos';
import { FilterTabs } from './FilterTabs';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { PedidoCard } from './PedidoCard';

type FilterType = 'todos' | 'pendente' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado';

export const AppointmentSystem: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('todos');
  const { profile } = useAuth();
  const { pedidos, loading, updatePedidoStatus } = usePedidos(profile?.id);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const filteredPedidos = pedidos.filter(pedido => 
    filter === 'todos' || pedido.status === filter
  );

  const isPrestador = profile?.tipo === 'prestador';
  const isMobile = window.innerWidth < 768;

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
              currentUser={profile as any}
              onUpdate={() => {}}
            />
          ))
        )}
      </div>
    </div>
  );
};
