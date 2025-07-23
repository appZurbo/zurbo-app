
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, CheckCircle, AlertTriangle, MessageCircle, ShoppingBag, Wrench, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreateTestData } from '@/components/admin/CreateTestData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();

  const [userCount, setUserCount] = useState(0);
  const [prestadorCount, setPrestadorCount] = useState(0);
  const [pedidoCount, setPedidoCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [conversationCount, setConversationCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const loadStats = async () => {
    try {
      // Get user counts
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      setUserCount(usersCount || 0);

      const { count: prestadoresCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'prestador');
      setPrestadorCount(prestadoresCount || 0);

      const { count: pedidosCount } = await supabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true });
      setPedidoCount(pedidosCount || 0);

      const { count: reviewsCount } = await supabase
        .from('avaliacoes')
        .select('*', { count: 'exact', head: true });
      setReviewCount(reviewsCount || 0);

      const { count: conversationsCount } = await supabase
        .from('chat_conversations')
        .select('*', { count: 'exact', head: true });
      setConversationCount(conversationsCount || 0);

    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Esta página é exclusiva para administradores.
              </p>
              <Button onClick={() => navigate('/')}>
                Voltar à Página Inicial
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UnifiedHeader />
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-7xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && 'Voltar'}
            </Button>
            <div className="flex-1">
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                Painel do Administrador
              </h1>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                Visão geral e ferramentas de gestão
              </p>
            </div>
          </div>

          {/* Test Data Section */}
          <div className="mb-6">
            <CreateTestData />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userCount}</p>
                <p className="text-sm text-gray-500">Total de usuários cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-500" />
                  Prestadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{prestadorCount}</p>
                <p className="text-sm text-gray-500">Total de prestadores de serviço</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  Conversas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{conversationCount}</p>
                <p className="text-sm text-gray-500">Total de conversas iniciadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                  Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{pedidoCount}</p>
                <p className="text-sm text-gray-500">Total de pedidos realizados</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Avaliações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{reviewCount}</p>
                <p className="text-sm text-gray-500">Total de avaliações recebidas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Banco de Dados</span>
                    <span className="text-green-600 text-sm font-medium">✅ Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chat em Tempo Real</span>
                    <span className="text-green-600 text-sm font-medium">✅ Ativo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dados de Teste</span>
                    <span className={`text-sm font-medium ${conversationCount > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {conversationCount > 0 ? '✅ Disponível' : '⚠️ Executar Criação'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => navigate('/admin/users')}
                  variant="outline"
                  className="justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Usuários
                </Button>
                <Button
                  onClick={() => navigate('/conversas')}
                  variant="outline"
                  className="justify-start"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ver Conversas
                </Button>
                <Button
                  onClick={() => navigate('/prestadores')}
                  variant="outline"
                  className="justify-start"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Ver Prestadores
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="justify-start"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Atualizar Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
