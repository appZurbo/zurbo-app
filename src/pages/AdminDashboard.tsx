import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, Plus, Users, CheckCircle, AlertTriangle, MessageCircle, ShoppingBag, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createFakeUsers, createFakePrestadores, createFakeAgendamentos, createFakeHistorico } from '@/utils/database/fake-data';
import { createCompleteTestData } from '@/utils/database/create-complete-test-data';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();

  const [userCount, setUserCount] = useState(0);
  const [prestadorCount, setPrestadorCount] = useState(0);
  const [pedidoCount, setPedidoCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [creatingTestData, setCreatingTestData] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const loadStats = async () => {
    try {
      const { data: users, error: usersError, count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: false });

      if (usersError) throw usersError;
      setUserCount(usersCount || 0);

      const { data: prestadores, error: prestadoresError, count: prestadoresCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: false })
        .eq('tipo', 'prestador');

      if (prestadoresError) throw prestadoresError;
      setPrestadorCount(prestadoresCount || 0);

      const { data: pedidos, error: pedidosError, count: pedidosCount } = await supabase
        .from('pedidos')
        .select('*', { count: 'exact', head: false });

      if (pedidosError) throw pedidosError;
      setPedidoCount(pedidosCount || 0);

      const { data: reviews, error: reviewsError, count: reviewsCount } = await supabase
        .from('avaliacoes')
        .select('*', { count: 'exact', head: false });

      if (reviewsError) throw reviewsError;
      setReviewCount(reviewsCount || 0);

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

  const handleCreateTestData = async () => {
    setCreatingTestData(true);
    try {
      await createFakeUsers();
      await createFakePrestadores();
      await createFakeAgendamentos();
      await createFakeHistorico();
      toast({
        title: "Sucesso",
        description: "Dados de teste básicos criados com sucesso!",
      });
      loadStats();
    } catch (error) {
      console.error('Error creating test data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar os dados de teste.",
        variant: "destructive"
      });
    } finally {
      setCreatingTestData(false);
    }
  };

  const handleCreateCompleteTestData = async () => {
    setCreatingTestData(true);
    try {
      const success = await createCompleteTestData();
      if (success) {
        toast({
          title: "Sucesso",
          description: "Dados de teste completos criados com sucesso! Inclui conversas, mensagens, pedidos e agendamentos.",
        });
        // Refresh data
        loadStats();
      } else {
        throw new Error('Failed to create test data');
      }
    } catch (error) {
      console.error('Error creating test data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar os dados de teste.",
        variant: "destructive"
      });
    } finally {
      setCreatingTestData(false);
    }
  };

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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                Dados de Teste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleCreateTestData}
                  disabled={creatingTestData}
                  className="flex items-center gap-2"
                >
                  {creatingTestData ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Criar Dados Básicos
                </Button>
                
                <Button
                  onClick={handleCreateCompleteTestData}
                  disabled={creatingTestData}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                >
                  {creatingTestData ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Database className="h-4 w-4" />
                  )}
                  Criar Sistema Completo de Teste
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                O sistema completo inclui: conversas em tempo real, mensagens, pedidos, agendamentos, 
                contas premium e dados para teste de moderação.
              </p>
            </CardContent>
          </Card>

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
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                  Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{pedidoCount}</p>
                <p className="text-sm text-gray-500">Total de pedidos realizados</p>
              </CardContent>
            </Card>

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
          </div>

          {/* Alerts and Notices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Alertas e Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                <li>
                  <span className="font-semibold">Aviso:</span> Monitorar a fila de denúncias de usuários.
                </li>
                <li>
                  <span className="font-semibold">Alerta:</span> Verificar a integridade dos dados dos usuários.
                </li>
                <li>
                  <span className="font-semibold">Aviso:</span> O sistema está em constante atualização.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
