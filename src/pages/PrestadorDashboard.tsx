
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Calendar, 
  MessageCircle, 
  Star, 
  TrendingUp, 
  Users, 
  Eye, 
  Crown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PiggyBank
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isToday, isTomorrow, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardStats {
  pedidosAtivos: number;
  avaliacaoMedia: number;
  faturamentoTotal: number;
  dinheiroAReceber: number;
  visualizacoes: number;
  servicosConcluidos: number;
  agendamentosHoje: number;
  agendamentosAmanha: number;
}

interface Agendamento {
  id: string;
  titulo: string;
  data_agendada: string;
  hora_agendada: string;
  status: string;
  cliente_nome?: string;
  preco_acordado?: number;
}

const PrestadorDashboard = () => {
  const navigate = useNavigate();
  const { profile, isPrestador, loading } = useAuth();
  const isMobile = useMobile();
  const [stats, setStats] = useState<DashboardStats>({
    pedidosAtivos: 0,
    avaliacaoMedia: 0,
    faturamentoTotal: 0,
    dinheiroAReceber: 0,
    visualizacoes: 0,
    servicosConcluidos: 0,
    agendamentosHoje: 0,
    agendamentosAmanha: 0
  });
  const [agendamentosRecentes, setAgendamentosRecentes] = useState<Agendamento[]>([]);
  const [periodFilter, setPeriodFilter] = useState('month');
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (profile && isPrestador) {
      loadDashboardData();
    }
  }, [profile, isPrestador, periodFilter]);

  const loadDashboardData = async () => {
    if (!profile) return;
    
    setLoadingStats(true);
    try {
      // Load agendamentos
      const { data: agendamentos, error: agendamentosError } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('prestador_id', profile.id)
        .order('data_agendada', { ascending: true });

      if (agendamentosError) throw agendamentosError;

      // Load pedidos
      const { data: pedidos, error: pedidosError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('prestador_id', profile.id);

      if (pedidosError) throw pedidosError;

      // Load avaliacoes
      const { data: avaliacoes, error: avaliacoesError } = await supabase
        .from('avaliacoes')
        .select('nota')
        .eq('avaliado_id', profile.id);

      if (avaliacoesError) throw avaliacoesError;

      // Process data
      const hoje = new Date();
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);

      const agendamentosHoje = agendamentos?.filter(a => 
        isToday(parseISO(a.data_agendada))
      ).length || 0;

      const agendamentosAmanha = agendamentos?.filter(a => 
        isTomorrow(parseISO(a.data_agendada))
      ).length || 0;

      const pedidosAtivos = pedidos?.filter(p => 
        ['pendente', 'confirmado'].includes(p.status)
      ).length || 0;

      const servicosConcluidos = pedidos?.filter(p => 
        p.status === 'concluido'
      ).length || 0;

      const avaliacaoMedia = avaliacoes?.length ? 
        avaliacoes.reduce((acc, av) => acc + (av.nota || 0), 0) / avaliacoes.length : 0;

      // Calculate revenue based on period
      let faturamentoTotal = 0;
      let dinheiroAReceber = 0;

      if (pedidos) {
        const now = new Date();
        let startDate, endDate;

        switch (periodFilter) {
          case 'day':
            startDate = startOfDay(now);
            endDate = endOfDay(now);
            break;
          case 'month':
            startDate = startOfMonth(now);
            endDate = endOfMonth(now);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
            break;
          default:
            startDate = startOfMonth(now);
            endDate = endOfMonth(now);
        }

        pedidos.forEach(pedido => {
          const pedidoDate = parseISO(pedido.created_at);
          if (pedidoDate >= startDate && pedidoDate <= endDate) {
            if (pedido.status === 'concluido' && pedido.preco_acordado) {
              faturamentoTotal += pedido.preco_acordado;
            }
            if (['pendente', 'confirmado'].includes(pedido.status) && pedido.preco_acordado) {
              dinheiroAReceber += pedido.preco_acordado;
            }
          }
        });
      }

      setStats({
        pedidosAtivos,
        avaliacaoMedia: Number(avaliacaoMedia.toFixed(1)),
        faturamentoTotal,
        dinheiroAReceber,
        visualizacoes: 1543, // Mock data
        servicosConcluidos,
        agendamentosHoje,
        agendamentosAmanha
      });

      // Set recent appointments
      const recentAppointments = agendamentos?.slice(0, 5) || [];
      setAgendamentosRecentes(recentAppointments);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const getPeriodLabel = () => {
    switch (periodFilter) {
      case 'day':
        return 'Hoje';
      case 'month':
        return 'Este Mês';
      case 'year':
        return 'Este Ano';
      default:
        return 'Este Mês';
    }
  };

  if (loading) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando painel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Você precisa estar logado para acessar o painel.
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full">
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isPrestador) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Este painel é exclusivo para prestadores de serviços.
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
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
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-6xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <div>
                    <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                      Painel do Prestador
                    </h1>
                    <div className="flex items-center gap-2">
                      <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                        Bem-vindo, {profile.nome}
                      </p>
                      {profile.premium && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          PRO
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Hoje</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={() => navigate('/agenda-prestador')} className="bg-orange-500 hover:bg-orange-600">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Agenda
              </Button>
            </div>
          </div>

          {/* Alert for upcoming appointments */}
          {(stats.agendamentosHoje > 0 || stats.agendamentosAmanha > 0) && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">
                      {stats.agendamentosHoje > 0 && `${stats.agendamentosHoje} agendamento(s) hoje`}
                      {stats.agendamentosHoje > 0 && stats.agendamentosAmanha > 0 && ' • '}
                      {stats.agendamentosAmanha > 0 && `${stats.agendamentosAmanha} agendamento(s) amanhã`}
                    </p>
                    <p className="text-sm text-orange-600">Não esqueça de se preparar para seus compromissos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Revenue Statistics */}
          <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Faturamento {getPeriodLabel()}</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {loadingStats ? '...' : stats.faturamentoTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">A Receber</p>
                    <p className="text-2xl font-bold text-blue-600">
                      R$ {loadingStats ? '...' : stats.dinheiroAReceber.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Serviços Concluídos</p>
                    <p className="text-2xl font-bold">{loadingStats ? '...' : stats.servicosConcluidos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Avaliação Média</p>
                    <p className="text-2xl font-bold">{loadingStats ? '...' : stats.avaliacaoMedia}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* General Statistics */}
          <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Pedidos Ativos</p>
                    <p className="text-2xl font-bold">{loadingStats ? '...' : stats.pedidosAtivos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Hoje</p>
                    <p className="text-2xl font-bold">{loadingStats ? '...' : stats.agendamentosHoje}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Amanhã</p>
                    <p className="text-lg font-bold">{loadingStats ? '...' : stats.agendamentosAmanha}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Visualizações</p>
                    <p className="text-2xl font-bold">{stats.visualizacoes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Summary and Quick Actions */}
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            {/* Calendar Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Resumo da Agenda
                </CardTitle>
              </CardHeader>
              <CardContent>
                {agendamentosRecentes.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-3">Nenhum agendamento próximo</p>
                    <Button onClick={() => navigate('/agenda-prestador')} variant="outline" size="sm">
                      Ver Agenda Completa
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {agendamentosRecentes.map(agendamento => (
                      <div key={agendamento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{agendamento.titulo}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                            <span>{format(parseISO(agendamento.data_agendada), 'dd/MM')}</span>
                            <span>{agendamento.hora_agendada}</span>
                            {agendamento.cliente_nome && <span>{agendamento.cliente_nome}</span>}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {agendamento.status === 'confirmado' ? 'Confirmado' : 
                           agendamento.status === 'pendente' ? 'Pendente' : agendamento.status}
                        </Badge>
                      </div>
                    ))}
                    <Button onClick={() => navigate('/agenda-prestador')} variant="outline" className="w-full">
                      Ver Agenda Completa
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Button onClick={() => navigate('/agenda-prestador')} variant="outline" className="justify-start h-auto p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      <div className="text-left">
                        <p className="font-medium">Gerenciar Agenda</p>
                        <p className="text-sm text-gray-600">Veja e organize seus compromissos</p>
                      </div>
                    </div>
                  </Button>

                  <Button onClick={() => navigate('/conversas')} variant="outline" className="justify-start h-auto p-4">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <div className="text-left">
                        <p className="font-medium">Conversas</p>
                        <p className="text-sm text-gray-600">Converse com seus clientes</p>
                      </div>
                    </div>
                  </Button>

                  <Button onClick={() => navigate('/settings')} variant="outline" className="justify-start h-auto p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-500" />
                      <div className="text-left">
                        <p className="font-medium">Configurações</p>
                        <p className="text-sm text-gray-600">Edite suas informações e serviços</p>
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade PRO */}
          {!profile.premium && (
            <Card className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Upgrade para PRO</h3>
                    <p className="text-yellow-100 mb-4">
                      Destaque-se da concorrência e aumente seus ganhos
                    </p>
                    <ul className="text-sm text-yellow-100 space-y-1">
                      <li>• Destaque em pesquisas</li>
                      <li>• Relatórios avançados</li>
                      <li>• Suporte prioritário</li>
                    </ul>
                  </div>
                  <Button onClick={() => navigate('/planos')} className="bg-white text-yellow-600 hover:bg-gray-50">
                    <Crown className="h-4 w-4 mr-2" />
                    Ver Planos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrestadorDashboard;
