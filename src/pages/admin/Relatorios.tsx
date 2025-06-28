import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, TrendingUp, Users, DollarSign, Calendar, Download, BarChart3, PieChart, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useMobile } from '@/hooks/useMobile';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { CreateTestData } from '@/components/admin/CreateTestData';

const Relatorios = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isMobile = useMobile();
  const [timeRange, setTimeRange] = useState('30');

  // Mock data - em uma aplicação real, esses dados viriam do banco
  const kpiData = {
    totalUsers: 2547,
    totalProviders: 342,
    totalOrders: 1823,
    totalRevenue: 89420.50,
    monthlyGrowth: 15.2,
    activeUsers: 1890,
    completedOrders: 1654,
    averageRating: 4.7
  };

  const userGrowthData = [
    { month: 'Jan', users: 1200, providers: 150 },
    { month: 'Fev', users: 1350, providers: 180 },
    { month: 'Mar', users: 1500, providers: 210 },
    { month: 'Abr', users: 1680, providers: 245 },
    { month: 'Mai', users: 1890, providers: 280 },
    { month: 'Jun', users: 2100, providers: 310 },
    { month: 'Jul', users: 2300, providers: 342 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Fev', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Abr', revenue: 61000 },
    { month: 'Mai', revenue: 70000 },
    { month: 'Jun', revenue: 78000 },
    { month: 'Jul', revenue: 89420 },
  ];

  const serviceDistribution = [
    { name: 'Elétrica', value: 25, color: '#f97316' },
    { name: 'Encanamento', value: 20, color: '#3b82f6' },
    { name: 'Limpeza', value: 18, color: '#10b981' },
    { name: 'Jardinagem', value: 15, color: '#8b5cf6' },
    { name: 'Pintura', value: 12, color: '#f59e0b' },
    { name: 'Outros', value: 10, color: '#6b7280' },
  ];

  const topProviders = [
    { name: 'João Silva', orders: 145, rating: 4.9, revenue: 8500 },
    { name: 'Maria Santos', orders: 132, rating: 4.8, revenue: 7800 },
    { name: 'Pedro Costa', orders: 118, rating: 4.7, revenue: 6900 },
    { name: 'Ana Oliveira', orders: 105, rating: 4.9, revenue: 6200 },
    { name: 'Carlos Mendes', orders: 98, rating: 4.6, revenue: 5800 },
  ];

  const systemHealth = [
    { metric: 'Uptime', value: '99.9%', status: 'excellent' },
    { metric: 'Response Time', value: '120ms', status: 'good' },
    { metric: 'Error Rate', value: '0.1%', status: 'excellent' },
    { metric: 'Active Sessions', value: '1,234', status: 'good' },
  ];

  const handleKpiClick = (type: string) => {
    switch (type) {
      case 'users':
        navigate('/settings'); // Página de configurações onde há informações de usuários
        break;
      case 'providers':
        navigate('/prestadores'); // Página existente de prestadores
        break;
      case 'orders':
        navigate('/conversas'); // Página existente de conversas/pedidos
        break;
      case 'revenue':
        navigate('/admin'); // Volta para o dashboard admin
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
                onClick={() => navigate('/admin')}
                className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {!isMobile && 'Voltar'}
              </Button>
              <div>
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                  Relatórios e Analytics
                </h1>
                <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                  Insights e métricas da plataforma Zurbo
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

          {/* Dashboard Layout - Desktop/Tablet: KPIs left, Test Data right */}
          <div className={`mb-8 ${isMobile ? '' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}`}>
            {/* KPIs Section */}
            <div className={`${isMobile ? 'mb-6' : 'lg:col-span-2'}`}>
              <div className="grid grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleKpiClick('users')}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Usuários Total</p>
                        <p className="text-2xl font-bold">{kpiData.totalUsers.toLocaleString()}</p>
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
                        <p className="text-2xl font-bold">{kpiData.totalProviders}</p>
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
                        <p className="text-2xl font-bold">{kpiData.totalOrders.toLocaleString()}</p>
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
                        <p className="text-2xl font-bold">R$ {kpiData.totalRevenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Test Data Creation Section - Right side for desktop/tablet */}
            <div className={`${isMobile ? '' : 'lg:col-span-1'}`}>
              <CreateTestData />
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="revenue">Receita</TabsTrigger>
              <TabsTrigger value="services">Serviços</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Crescimento de Usuários
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-24 ml-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7d</SelectItem>
                          <SelectItem value="30">30d</SelectItem>
                          <SelectItem value="90">90d</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Download className="h-4 w-4 mr-1" />
                        Exportar
                      </Button>
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

              {/* Split section - Top Providers and System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Prestadores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topProviders.map((provider, index) => (
                        <div key={provider.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-semibold">{provider.name}</p>
                              <p className="text-sm text-gray-600">{provider.orders} pedidos • ⭐ {provider.rating}</p>
                            </div>
                          </div>
                          <p className="font-bold text-green-600">R$ {provider.revenue.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status do Sistema</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemHealth.map((item, index) => (
                        <div key={item.metric} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              item.status === 'excellent' ? 'bg-green-500' : 
                              item.status === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className="font-medium">{item.metric}</span>
                          </div>
                          <span className="font-bold">{item.value}</span>
                        </div>
                      ))}
                      <div className="mt-4 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/ads')}
                        >
                          Ver Anúncios do Sistema
                        </Button>
                      </div>
                    </div>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{kpiData.activeUsers}</p>
                      <p className="text-sm text-gray-600">Usuários Ativos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{kpiData.monthlyGrowth}%</p>
                      <p className="text-sm text-gray-600">Crescimento Mensal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-orange-600">{kpiData.totalProviders}</p>
                      <p className="text-sm text-gray-600">Prestadores Ativos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{kpiData.averageRating}</p>
                      <p className="text-sm text-gray-600">Avaliação Média</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#3b82f6" name="Usuários" />
                      <Bar dataKey="providers" fill="#f97316" name="Prestadores" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução da Receita</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Receita']} />
                      <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Serviços</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Serviços Mais Solicitados</h4>
                      <div className="space-y-3">
                        {serviceDistribution.map((service, index) => (
                          <div key={service.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: service.color }}
                              />
                              <span>{service.name}</span>
                            </div>
                            <span className="font-semibold">{service.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={serviceDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                          >
                            {serviceDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
