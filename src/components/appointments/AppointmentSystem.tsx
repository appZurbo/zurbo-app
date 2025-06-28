
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, MapPin, DollarSign, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { getPedidos, updatePedido } from '@/utils/database/pedidos';
import { Pedido } from '@/utils/database/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type FilterType = 'todos' | 'pendente' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado';

export const AppointmentSystem: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('todos');
  const { profile } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleStatusUpdate = async (pedidoId: string, newStatus: string) => {
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

  const filteredPedidos = pedidos.filter(pedido => 
    filter === 'todos' || pedido.status === filter
  );

  const isPrestador = profile?.tipo === 'prestador';

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-sm text-gray-600 mt-2">Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {isPrestador ? 'Pedidos Recebidos' : 'Meus Agendamentos'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} h-auto p-1`}>
              <TabsTrigger value="todos" className="text-xs py-2 px-3">
                Todos
              </TabsTrigger>
              <TabsTrigger value="pendente" className="text-xs py-2 px-3">
                Pendente
              </TabsTrigger>
              <TabsTrigger value="aceito" className="text-xs py-2 px-3">
                Aceito
              </TabsTrigger>
              {!isMobile && (
                <>
                  <TabsTrigger value="em_andamento" className="text-xs py-2 px-3">
                    Andamento
                  </TabsTrigger>
                  <TabsTrigger value="concluido" className="text-xs py-2 px-3">
                    Concluído
                  </TabsTrigger>
                  <TabsTrigger value="cancelado" className="text-xs py-2 px-3">
                    Cancelado
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pedidos List */}
      <div className="space-y-4">
        {filteredPedidos.length === 0 ? (
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
        ) : (
          filteredPedidos.map((pedido) => {
            const statusInfo = getStatusInfo(pedido.status);
            const isMyPedido = isPrestador 
              ? pedido.prestador_id === profile?.id 
              : pedido.cliente_id === profile?.id;
            
            return (
              <Card key={pedido.id} className="hover:shadow-md transition-shadow">
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
                            onClick={() => handleStatusUpdate(pedido.id, 'aceito')}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            Aceitar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleStatusUpdate(pedido.id, 'cancelado')}
                            className="text-red-600 hover:text-red-700"
                          >
                            Recusar
                          </Button>
                        </>
                      )}
                      
                      {isPrestador && pedido.status === 'em_andamento' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusUpdate(pedido.id, 'concluido')}
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
          })
        )}
      </div>
    </div>
  );
};
