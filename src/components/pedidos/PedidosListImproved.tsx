
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  DollarSign,
  User
} from 'lucide-react';

const pedidosFake = [
  {
    id: '1',
    titulo: 'Instalação elétrica',
    cliente: 'Pedro Costa',
    servico: 'Eletricista',
    endereco: 'Vila Madalena, São Paulo',
    preco: 150,
    status: 'pendente',
    data: '2024-01-20',
    descricao: 'Instalação de tomadas na cozinha'
  },
  {
    id: '2',
    titulo: 'Vazamento no banheiro',
    cliente: 'Julia Ferreira',
    servico: 'Encanador',
    endereco: 'Pinheiros, São Paulo',
    preco: 200,
    status: 'em_andamento',
    data: '2024-01-19',
    descricao: 'Reparo de vazamento em torneira'
  },
  {
    id: '3',
    titulo: 'Pintura sala',
    cliente: 'Ana Santos',
    servico: 'Pintor',
    endereco: 'Jardins, São Paulo',
    preco: 300,
    status: 'concluido',
    data: '2024-01-18',
    descricao: 'Pintura completa da sala de estar'
  }
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'pendente':
      return { 
        label: 'Pendente', 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock 
      };
    case 'em_andamento':
      return { 
        label: 'Em Andamento', 
        color: 'bg-blue-100 text-blue-800', 
        icon: AlertCircle 
      };
    case 'concluido':
      return { 
        label: 'Concluído', 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle 
      };
    case 'cancelado':
      return { 
        label: 'Cancelado', 
        color: 'bg-red-100 text-red-800', 
        icon: XCircle 
      };
    default:
      return { 
        label: 'Desconhecido', 
        color: 'bg-gray-100 text-gray-800', 
        icon: Clock 
      };
  }
};

export const PedidosListImproved: React.FC = () => {
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  const pedidosFiltrados = pedidosFake.filter(pedido => 
    filtroStatus === 'todos' || pedido.status === filtroStatus
  );

  const renderPedidoCard = (pedido: any) => {
    const statusInfo = getStatusInfo(pedido.status);
    const StatusIcon = statusInfo.icon;

    return (
      <Card key={pedido.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Informações principais */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg text-gray-900">
                  {pedido.titulo}
                </h3>
                <Badge className={statusInfo.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{pedido.cliente}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{pedido.endereco}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(pedido.data).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium text-green-600">
                    R$ {pedido.preco}
                  </span>
                </div>
              </div>

              {pedido.descricao && (
                <p className="text-sm text-gray-500 mt-2">
                  {pedido.descricao}
                </p>
              )}
            </div>

            {/* Ações - Stack em mobile, inline no desktop */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              {pedido.status === 'pendente' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    Aceitar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 sm:flex-none text-red-600 hover:text-red-700"
                  >
                    Recusar
                  </Button>
                </>
              )}
              {pedido.status === 'em_andamento' && (
                <Button 
                  size="sm"
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                >
                  Finalizar
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                className="flex-1 sm:flex-none"
              >
                Detalhes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filtros melhorados para mobile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Histórico de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={filtroStatus} onValueChange={setFiltroStatus}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
              <TabsTrigger 
                value="todos" 
                className="text-xs py-2 px-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Todos
              </TabsTrigger>
              <TabsTrigger 
                value="pendente" 
                className="text-xs py-2 px-3 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
              >
                Pendente
              </TabsTrigger>
              <TabsTrigger 
                value="em_andamento" 
                className="text-xs py-2 px-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Andamento
              </TabsTrigger>
              <TabsTrigger 
                value="concluido" 
                className="text-xs py-2 px-3 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                Concluído
              </TabsTrigger>
              <TabsTrigger 
                value="cancelado" 
                className="text-xs py-2 px-3 data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Cancelado
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {pedidosFiltrados.length > 0 ? (
          pedidosFiltrados.map(renderPedidoCard)
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Clock className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-500">
                {filtroStatus === 'todos' 
                  ? 'Você ainda não tem pedidos.' 
                  : `Você não tem pedidos com status "${getStatusInfo(filtroStatus).label}".`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
