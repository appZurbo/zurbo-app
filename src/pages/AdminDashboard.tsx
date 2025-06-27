
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  UserCheck,
  Crown,
  MessageSquare,
  ArrowLeft,
  TrendingUp,
  Calendar,
  Star,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { CreateTestData } from '@/components/admin/CreateTestData';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();
  const isMobile = useMobile();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPrestadores: 0,
    totalClientes: 0,
    totalPedidos: 0,
    pedidosPendentes: 0,
    pedidosCompletos: 0,
    avaliacaoMedia: 0,
    usuariosAtivos: 0
  });

  useEffect(() => {
    // Simular dados para demonstração
    setStats({
      totalUsers: 1247,
      totalPrestadores: 89,
      totalClientes: 1158,
      totalPedidos: 3428,
      pedidosPendentes: 23,
      pedidosCompletos: 3405,
      avaliacaoMedia: 4.7,
      usuariosAtivos: 847
    });
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600 mb-4">
              Esta área é exclusiva para administradores do sistema.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-7xl mx-auto p-6'}`}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {!isMobile && 'Voltar'}
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                  Painel Administrativo
                </h1>
                <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                  Bem-vindo, {profile?.nome}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Usuários</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Prestadores</p>
                  <p className="text-2xl font-bold">{stats.totalPrestadores}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Pedidos</p>
                  <p className="text-2xl font-bold">{stats.totalPedidos.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Avaliação</p>
                  <p className="text-2xl font-bold">{stats.avaliacaoMedia}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tools Section */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                Ferramentas de Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CreateTestData />
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-4 text-center">
                    <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <h3 className="font-semibold mb-2">Console do Navegador</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Execute comandos diretamente no console do navegador:
                    </p>
                    <code className="text-xs bg-gray-100 p-2 rounded block">
                      await createAllFakeData()
                    </code>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/moderacao')}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                Moderação de Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gerenciar denúncias, revisar conteúdo e moderar usuários
              </p>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {stats.pedidosPendentes} pendentes
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/sistema')}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Ajustar configurações globais, preços e parâmetros do sistema
              </p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Sistema ativo
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/relatorios')}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Relatórios e Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Visualizar métricas detalhadas e relatórios de desempenho
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Disponível
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Novo prestador cadastrado</span>
                </div>
                <span className="text-xs text-gray-500">há 5 min</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Pedido concluído</span>
                </div>
                <span className="text-xs text-gray-500">há 12 min</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Nova avaliação recebida</span>
                </div>
                <span className="text-xs text-gray-500">há 18 min</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Sistema atualizado</span>
                </div>
                <span className="text-xs text-gray-500">há 1 hora</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
