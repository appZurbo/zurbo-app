
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, TrendingUp, Users, DollarSign, Calendar, Download, BarChart3, PieChart, Activity, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useMobile } from '@/hooks/useMobile';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { CreateTestData } from '@/components/admin/CreateTestData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Relatorios = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('30');

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeUsers: 0,
    completedOrders: 0,
    averageRating: 0
  });

  const loadStats = async () => {
    try {
      // Get user counts
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: prestadoresCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'prestador');

      const { count: pedidosCount } = await supabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true });

      const { count: reviewsCount } = await supabase
        .from('avaliacoes')
        .select('*', { count: 'exact', head: true });

      const { count: conversationsCount } = await supabase
        .from('chat_conversations')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: usersCount || 0,
        totalProviders: prestadoresCount || 0,
        totalOrders: pedidosCount || 0,
        totalRevenue: Math.random() * 100000, // Mock data
        monthlyGrowth: Math.random() * 20,
        activeUsers: Math.floor((usersCount || 0) * 0.7),
        completedOrders: Math.floor((pedidosCount || 0) * 0.8),
        averageRating: 4.5 + Math.random() * 0.5
      });

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

  // Mock data for charts
  const userGrowthData = [
    { month: 'Jan', users: 1200, providers: 150 },
    { month: 'Fev', users: 1350, providers: 180 },
    { month: 'Mar', users: 1500, providers: 210 },
    { month: 'Abr', users: 1680, providers: 245 },
    { month: 'Mai', users: 1890, providers: 280 },
    { month: 'Jun', users: 2100, providers: 310 },
    { month: 'Jul', users: stats.totalUsers, providers: stats.totalProviders },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Fev', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Abr', revenue: 61000 },
    { month: 'Mai', revenue: 70000 },
    { month: 'Jun', users: 78000 },
    { month: 'Jul', revenue: stats.totalRevenue },
  ];

  const serviceDistribution = [
    { name: 'Elétrica', value: 25, color: '#f97316' },
    { name: 'Encanamento', value: 20, color: '#3b82f6' },
    { name: 'Limpeza', value: 18, color: '#10b981' },
    { name: 'Jardinagem', value: 15, color: '#8b5cf6' },
    { name: 'Pintura', value: 12, color: '#f59e0b' },
    { name: 'Outros', value: 10, color: '#6b7280' },
  ];

  const handleKpiClick = (type: string) => {
    switch (type) {
      case 'users':
        navigate('/admin/users');
        break;
      case 'providers':
        navigate('/admin/prestadores');
        break;
      case 'orders':
        navigate('/conversas');
        break;
      case 'revenue':
        navigate('/admin');
        break;
      default:
        break;
    }
  };

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {!isMobile && 'Voltar'}
              </Button>
              <div>
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                  Painel Administrativo
                </h1>
                <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                  Relatórios e analytics da plataforma
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="90">90 dias</SelectItem>
                  <SelectItem value="365">1 ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleKpiClick('users')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Usuários Total</p>
                    <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleKpiClick('providers')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Prestadores</p>
                    <p className="text-2xl font-bold">{stats.totalProviders}</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleKpiClick('orders')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pedidos</p>
                    <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleKpiClick('revenue')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Receita</p>
                    <p className="text-2xl font-bold">R$ {stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => navigate('/admin/users')}
                  variant="outline"
                  className="justify-start h-12"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Usuários
                </Button>
                <Button
                  onClick={() => navigate('/admin/prestadores')}
                  variant="outline"
                  className="justify-start h-12"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Gerenciar Prestadores
                </Button>
                <Button
                  onClick={() => navigate('/admin/moderacao')}
                  variant="outline"
                  className="justify-start h-12"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Moderação de Conteúdo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Data Section */}
          <div className="mb-6">
            <CreateTestData />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              {!isMobile && <TabsTrigger value="revenue">Receita</TabsTrigger>}
              {!isMobile && <TabsTrigger value="services">Serviços</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Crescimento de Usuários
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="providers" stroke="#f97316" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Distribuição de Serviços
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={serviceDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {serviceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded">
                      <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                      <p className="text-sm text-gray-600">Total</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <p className="text-2xl font-bold text-orange-600">{stats.totalProviders}</p>
                      <p className="text-sm text-gray-600">Prestadores</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                      <p className="text-sm text-gray-600">Ativos</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <p className="text-2xl font-bold text-purple-600">{stats.averageRating.toFixed(1)}</p>
                      <p className="text-sm text-gray-600">Avaliação Média</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {!isMobile && (
              <>
                <TabsContent value="revenue" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Receita Mensal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="revenue" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="services" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Serviços Mais Solicitados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {serviceDistribution.map((service, index) => (
                          <div key={service.name} className="flex items-center justify-between p-3 border rounded">
                            <span className="font-medium">{service.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full" 
                                  style={{ 
                                    width: `${service.value}%`, 
                                    backgroundColor: service.color 
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">{service.value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
