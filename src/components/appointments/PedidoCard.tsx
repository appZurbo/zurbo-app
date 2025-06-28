
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin, DollarSign, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Pedido } from '@/utils/database/types';

interface PedidoCardProps {
  pedido: Pedido;
  isPrestador: boolean;
  profileId?: string;
  onStatusUpdate: (pedidoId: string, newStatus: string) => void;
}

export const PedidoCard: React.FC<PedidoCardProps> = ({
  pedido,
  isPrestador,
  profileId,
  onStatusUpdate
}) => {
  const navigate = useNavigate();

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      aceito: { label: 'Aceito', color: 'bg-blue-100 text-blue-800', icon: Clock },
      em_andamento: { label: 'Em Andamento', color: 'bg-orange-100 text-orange-800', icon: Clock },
      concluido: { label: 'Concluído', color: 'bg-green-100 text-green-800', icon: Clock },
      cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: Clock }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
  };

  const statusInfo = getStatusInfo(pedido.status);
  const isMyPedido = isPrestador 
    ? pedido.prestador_id === profileId 
    : pedido.cliente_id === profileId;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Main Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg text-gray-900">
                {pedido.titulo}
              </h3>
              <Badge className={statusInfo.color}>
                {statusInfo.label}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>
                  {isPrestador 
                    ? `Cliente: ${pedido.cliente?.nome || 'N/A'}`
                    : `Prestador: ${pedido.prestador?.nome || 'N/A'}`
                  }
                </span>
              </div>
              
              {pedido.endereco_completo && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{pedido.endereco_completo}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(pedido.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              
              {pedido.preco_acordado && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium text-green-600">
                    R$ {pedido.preco_acordado.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {pedido.descricao && (
              <p className="text-sm text-gray-500">
                {pedido.descricao}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {isPrestador && pedido.status === 'pendente' && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => onStatusUpdate(pedido.id, 'aceito')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Aceitar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onStatusUpdate(pedido.id, 'cancelado')}
                  className="text-red-600 hover:text-red-700"
                >
                  Recusar
                </Button>
              </>
            )}
            
            {isPrestador && pedido.status === 'em_andamento' && (
              <Button 
                size="sm" 
                onClick={() => onStatusUpdate(pedido.id, 'concluido')}
                className="bg-green-600 hover:bg-green-700"
              >
                Finalizar
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/conversas')}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
