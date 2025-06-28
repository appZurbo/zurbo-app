
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

type FilterType = 'todos' | 'pendente' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado';

interface EmptyStateProps {
  filter: FilterType;
  isPrestador: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filter, isPrestador }) => {
  const getStatusInfo = (status: string) => {
    const statusConfig = {
      pendente: { label: 'Pendente' },
      aceito: { label: 'Aceito' },
      em_andamento: { label: 'Em Andamento' },
      concluido: { label: 'Concluído' },
      cancelado: { label: 'Cancelado' }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
  };

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {filter === 'todos' 
            ? (isPrestador ? 'Nenhum pedido recebido' : 'Nenhum agendamento encontrado')
            : `Nenhum pedido com status "${getStatusInfo(filter).label}"`
          }
        </h3>
        <p className="text-gray-500">
          {isPrestador 
            ? 'Quando clientes solicitarem seus serviços, eles aparecerão aqui.'
            : 'Seus agendamentos de serviços aparecerão aqui quando você contratar prestadores.'
          }
        </p>
      </CardContent>
    </Card>
  );
};
