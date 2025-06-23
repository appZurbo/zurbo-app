
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MessageCircle, Calendar, MapPin, Clock, User, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getPedidos } from '@/utils/database/pedidos';
import { Pedido } from '@/utils/database/types';
import { useToast } from '@/hooks/use-toast';

const Pedidos = () => {
  const navigate = useNavigate();
  const { profile, isPrestador, loading } = useAuth();
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);

  useEffect(() => {
    if (profile) {
      loadPedidos();
    }
  }, [profile]);

  const loadPedidos = async () => {
    if (!profile) return;
    
    setLoadingPedidos(true);
    try {
      const data = await getPedidos(profile.id);
      setPedidos(data);
    } catch (error) {
      console.error('Error loading pedidos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos.",
        variant: "destructive"
      });
    } finally {
      setLoadingPedidos(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'aceito': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-orange-100 text-orange-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aceito': return 'Aceito';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const filterPedidos = (status?: string) => {
    if (!status) return pedidos;
    return pedidos.filter(pedido => pedido.status === status);
  };

  const handleOpenChat = (pedido: Pedido) => {
    // Implementar navegação para chat
    navigate(`/chat?pedido=${pedido.id}`);
  };

  if (loading || loadingPedidos) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p>Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para ver seus pedidos.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Histórico de Pedidos
            </h1>
            <p className="text-gray-600">
              {isPrestador ? (
                <>
                  <Wrench className="h-4 w-4 inline mr-1" />
                  Serviços solicitados para você
                </>
              ) : (
                <>
                  <User className="h-4 w-4 inline mr-1" />
                  Seus pedidos de serviços
                </>
              )}
            </p>
          </div>
        </div>

        <Tabs defaultValue="todos" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pendente">Pendentes</TabsTrigger>
            <TabsTrigger value="aceito">Aceitos</TabsTrigger>
            <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
            <TabsTrigger value="concluido">Concluídos</TabsTrigger>
            <TabsTrigger value="cancelado">Cancelados</TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            <PedidosList pedidos={pedidos} onOpenChat={handleOpenChat} isPrestador={isPrestador} />
          </TabsContent>
          
          <TabsContent value="pendente">
            <PedidosList pedidos={filterPedidos('pendente')} onOpenChat={handleOpenChat} isPrestador={isPrestador} />
          </TabsContent>
          
          <TabsContent value="aceito">
            <PedidosList pedidos={filterPedidos('aceito')} onOpenChat={handleOpenChat} isPrestador={isPrestador} />
          </TabsContent>
          
          <TabsContent value="em_andamento">
            <PedidosList pedidos={filterPedidos('em_andamento')} onOpenChat={handleOpenChat} isPrestador={isPrestador} />
          </TabsContent>
          
          <TabsContent value="concluido">
            <PedidosList pedidos={filterPedidos('concluido')} onOpenChat={handleOpenChat} isPrestador={isPrestador} />
          </TabsContent>
          
          <TabsContent value="cancelado">
            <PedidosList pedidos={filterPedidos('cancelado')} onOpenChat={handleOpenChat} isPrestador={isPrestador} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface PedidosListProps {
  pedidos: Pedido[];
  onOpenChat: (pedido: Pedido) => void;
  isPrestador: boolean;
}

const PedidosList: React.FC<PedidosListProps> = ({ pedidos, onOpenChat, isPrestador }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'aceito': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-orange-100 text-orange-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aceito': return 'Aceito';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  if (pedidos.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
          <p className="text-gray-600">
            {isPrestador 
              ? 'Ainda não há pedidos de serviços para você.'
              : 'Você ainda não fez nenhum pedido de serviço.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pedidos.map((pedido) => {
        const otherUser = isPrestador ? pedido.cliente : pedido.prestador;
        
        return (
          <Card key={pedido.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={otherUser?.foto_url} />
                    <AvatarFallback>
                      {otherUser?.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{pedido.titulo}</h3>
                      <Badge className={getStatusColor(pedido.status)}>
                        {getStatusText(pedido.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {isPrestador ? 'Cliente: ' : 'Prestador: '}
                      <span className="font-medium">{otherUser?.nome}</span>
                    </p>
                    
                    {pedido.servico && (
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: pedido.servico.cor || '#f97316' }}
                        />
                        <span className="text-sm text-gray-600">{pedido.servico.nome}</span>
                      </div>
                    )}
                    
                    {pedido.descricao && (
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {pedido.descricao}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(pedido.data_solicitacao).toLocaleDateString('pt-BR')}
                      </div>
                      
                      {pedido.endereco_completo && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {pedido.endereco_completo}
                        </div>
                      )}
                      
                      {pedido.preco_acordado && (
                        <div className="font-medium text-green-600">
                          R$ {pedido.preco_acordado.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChat(pedido)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ver Conversa
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Pedidos;
