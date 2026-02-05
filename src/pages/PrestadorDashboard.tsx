
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
  Users,
  Eye,
  Crown,
  DollarSign,
  Clock,
  CheckCircle,
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
import { useOnDutyStatus } from '@/hooks/useOnDutyStatus';
import { Switch } from '@/components/ui/switch';
import { Activity } from 'lucide-react';
import { FinancialSection } from '@/components/financial/FinancialSection';

interface DashboardStats {
  pedidosAtivos: number;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  receitaEsteMes: number;
  dinheiroAReceber: number;
  visualizacoes: number;
  servicosConcluidosEsteMes: number;
  agendamentosHoje: number;
  agendamentosAmanha: number;
  mensagensAResponder: number;
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
  const { isOnDuty, loading: onDutyLoading, toggleOnDuty, canToggle } = useOnDutyStatus();
  const [stats, setStats] = useState<DashboardStats>({
    pedidosAtivos: 0,
    avaliacaoMedia: 0,
    totalAvaliacoes: 0,
    receitaEsteMes: 0,
    dinheiroAReceber: 0,
    visualizacoes: 0,
    servicosConcluidosEsteMes: 0,
    agendamentosHoje: 0,
    agendamentosAmanha: 0,
    mensagensAResponder: 0
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

      // Load conversas do prestador para "mensagens à responder"
      const { data: conversasPrestador } = await supabase
        .from('chat_conversations')
        .select('id, cliente_id')
        .eq('prestador_id', profile.id);

      let mensagensAResponder = 0;
      if (conversasPrestador && conversasPrestador.length > 0) {
        const convIds = conversasPrestador.map((c: { id: string }) => c.id);
        const { data: mensagens } = await supabase
          .from('chat_messages')
          .select('conversation_id, sender_id, created_at')
          .in('conversation_id', convIds)
          .order('created_at', { ascending: false });

        const mapaConv = Object.fromEntries(conversasPrestador.map((c: { id: string; cliente_id: string | null }) => [c.id, c.cliente_id]));
        const ultimaPorConv: Record<string, string | null> = {};
        mensagens?.forEach((m: { conversation_id: string | null; sender_id: string | null }) => {
          if (m.conversation_id && ultimaPorConv[m.conversation_id] === undefined) {
            ultimaPorConv[m.conversation_id] = m.sender_id;
          }
        });
        mensagensAResponder = Object.entries(ultimaPorConv).filter(
          ([cid, senderId]) => senderId && mapaConv[cid] && senderId === mapaConv[cid]
        ).length;
      }

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

      const startOfCurrentMonth = startOfMonth(hoje);
      const endOfCurrentMonth = endOfMonth(hoje);
      const servicosConcluidosEsteMes = pedidos?.filter(p =>
        p.status === 'concluido' &&
        parseISO(p.created_at) >= startOfCurrentMonth &&
        parseISO(p.created_at) <= endOfCurrentMonth
      ).length || 0;

      const totalAvaliacoes = avaliacoes?.length || 0;
      const avaliacaoMedia = avaliacoes?.length ?
        avaliacoes.reduce((acc, av) => acc + (av.nota || 0), 0) / avaliacoes.length : 0;

      // Receita deste mês e valor a receber (pedidos pendentes/confirmados no período)
      let receitaEsteMes = 0;
      let dinheiroAReceber = 0;

      if (pedidos) {
        const now = new Date();
        const inicioMes = startOfMonth(now);
        const fimMes = endOfMonth(now);
        let startPeriod = inicioMes;
        let endPeriod = fimMes;
        if (periodFilter === 'day') {
          startPeriod = startOfDay(now);
          endPeriod = endOfDay(now);
        } else if (periodFilter === 'year') {
          startPeriod = new Date(now.getFullYear(), 0, 1);
          endPeriod = new Date(now.getFullYear(), 11, 31);
        }

        pedidos.forEach(pedido => {
          const pedidoDate = parseISO(pedido.created_at);
          if (pedidoDate >= inicioMes && pedidoDate <= fimMes && pedido.status === 'concluido' && pedido.preco_acordado) {
            receitaEsteMes += pedido.preco_acordado;
          }
          if (pedidoDate >= startPeriod && pedidoDate <= endPeriod && ['pendente', 'confirmado'].includes(pedido.status) && pedido.preco_acordado) {
            dinheiroAReceber += pedido.preco_acordado;
          }
        });
      }

      setStats({
        pedidosAtivos,
        avaliacaoMedia: Number(avaliacaoMedia.toFixed(1)),
        totalAvaliacoes,
        receitaEsteMes,
        dinheiroAReceber,
        visualizacoes: 1543, // Mock data – contagem de visualizações do perfil
        servicosConcluidosEsteMes,
        agendamentosHoje,
        agendamentosAmanha,
        mensagensAResponder
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
          {/* Header with On-Duty Toggle */}
          <div className="mb-6">
            {/* On-Duty Toggle - Top of page */}
            {canToggle && (
              <Card className={`mb-4 transition-all duration-300 ${isOnDuty ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isOnDuty ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Status de Serviço</h3>
                        <p className={`text-sm ${isOnDuty ? 'text-orange-600' : 'text-gray-500'}`}>
                          {isOnDuty ? 'Você está disponível para chamados SOS' : 'Você não está recebendo chamados SOS'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${isOnDuty ? 'text-orange-600' : 'text-gray-500'}`}>
                        {isOnDuty ? 'Em Serviço' : 'Fora de Serviço'}
                      </span>
                      <Switch
                        checked={isOnDuty}
                        onCheckedChange={toggleOnDuty}
                        disabled={onDutyLoading}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Header */}
            <div className={`flex ${isMobile ? 'flex-col gap-6' : 'items-end justify-between'} mb-12`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                  <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                    Painel do <span className="text-orange-500">Prestador</span>
                  </h1>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <p className="text-gray-500 font-medium">
                    Bem-vindo, {profile.nome}
                  </p>
                  {profile.premium && (
                    <Badge className="bg-orange-500 text-white border-none font-black text-[10px] px-2">
                      <Crown className="h-3 w-3 mr-1" />
                      PRO
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-40 h-12 bg-white border-gray-200 rounded-xl font-bold uppercase text-[10px] tracking-widest text-gray-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100">
                    <SelectItem value="day" className="font-bold uppercase text-[10px] tracking-widest">Hoje</SelectItem>
                    <SelectItem value="month" className="font-bold uppercase text-[10px] tracking-widest">Este Mês</SelectItem>
                    <SelectItem value="year" className="font-bold uppercase text-[10px] tracking-widest">Este Ano</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => navigate('/agenda')}
                  className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-100 rounded-xl px-6 h-12 font-bold transition-all hover:scale-105 active:scale-95"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Ver Agenda
                </Button>
              </div>
            </div>
          </div>

          {/* Bloco 1 – Hoje e trabalho */}
          <div className="grid gap-4 mb-6 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Compromissos de Hoje</p>
                    <p className="text-2xl font-bold">{loadingStats ? '...' : stats.agendamentosHoje}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Solicitações ativas</p>
                    <p className="text-2xl font-bold">{loadingStats ? '...' : stats.pedidosAtivos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Concluídos este mês</p>
                    <p className="text-2xl font-bold">{loadingStats ? '...' : stats.servicosConcluidosEsteMes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-violet-500" />
                  <div>
                    <p className="text-sm text-gray-600">Mensagens à responder</p>
                    <p className="text-2xl font-bold">{loadingStats ? '...' : stats.mensagensAResponder}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bloco 2 – Dinheiro e reputação */}
          <div className="grid gap-4 mb-6 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Este mês</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {loadingStats ? '...' : stats.receitaEsteMes.toFixed(2)}
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
                    <p className="text-sm text-gray-600">A receber ({getPeriodLabel().toLowerCase()})</p>
                    <p className="text-2xl font-bold text-blue-600">
                      R$ {loadingStats ? '...' : stats.dinheiroAReceber.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex">
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Avaliação média</p>
                    <p className="text-2xl font-bold">{loadingStats ? '...' : stats.avaliacaoMedia}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stats.totalAvaliacoes} avaliações</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Visualizações do perfil</p>
                    <p className="text-2xl font-bold">{stats.visualizacoes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Section */}
          <div className="mb-6">
            <FinancialSection />
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
                    <Button onClick={() => navigate('/agenda')} variant="outline" size="sm">
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
                    <Button onClick={() => navigate('/agenda')} variant="outline" className="w-full">
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
                  <Button onClick={() => navigate('/agenda')} variant="outline" className="justify-start h-auto p-4">
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
