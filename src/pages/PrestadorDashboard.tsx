
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  TrendingUp, 
  Star, 
  Calendar, 
  MapPin, 
  Camera,
  Crown,
  DollarSign,
  Users,
  Clock
} from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';
import { listarAgendamentos, type Agendamento } from '@/utils/database/agendamentos';
import { verificarPlanoPremium, type PlanoPremium } from '@/utils/database/plano-premium';
import { listarBairrosAtendidos, type BairroAtendido } from '@/utils/database/bairros';
import { supabase } from '@/integrations/supabase/client';

const PrestadorDashboard = () => {
  const navigate = useNavigate();
  const { profile, isPrestador, loading } = useAuth();
  const isMobile = useMobile();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [planoPremium, setPlanoPremium] = useState<PlanoPremium | null>(null);
  const [bairros, setBairros] = useState<BairroAtendido[]>([]);
  const [stats, setStats] = useState({
    totalServicos: 0,
    valorRecebido: 0,
    avaliacoes: 0,
    notaMedia: 0
  });

  useEffect(() => {
    if (!loading && (!profile || !isPrestador)) {
      navigate('/');
      return;
    }

    if (profile && isPrestador) {
      carregarDados();
    }
  }, [profile, isPrestador, loading, navigate]);

  const carregarDados = async () => {
    try {
      // Carregar agendamentos
      const agendamentosData = await listarAgendamentos();
      setAgendamentos(agendamentosData);

      // Carregar plano premium
      const planoData = await verificarPlanoPremium();
      setPlanoPremium(planoData);

      // Carregar bairros
      const bairrosData = await listarBairrosAtendidos();
      setBairros(bairrosData);

      // Carregar estatísticas
      await carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      if (!profile) return;

      // Total de serviços realizados
      const { count: totalServicos } = await supabase
        .from('historico_servicos')
        .select('*', { count: 'exact', head: true })
        .eq('prestador_id', profile.id)
        .eq('status', 'concluido');

      // Valor total recebido
      const { data: servicosComValor } = await supabase
        .from('historico_servicos')
        .select('valor')
        .eq('prestador_id', profile.id)
        .eq('status', 'concluido');

      const valorTotal = servicosComValor?.reduce((total, servico) => 
        total + (parseFloat(servico.valor?.toString() || '0') || 0), 0) || 0;

      // Total de avaliações
      const { count: totalAvaliacoes } = await supabase
        .from('avaliacoes')
        .select('*', { count: 'exact', head: true })
        .eq('avaliado_id', profile.id);

      setStats({
        totalServicos: totalServicos || 0,
        valorRecebido: valorTotal,
        avaliacoes: totalAvaliacoes || 0,
        notaMedia: profile.nota_media || 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const proximosAgendamentos = agendamentos
    .filter(ag => ag.status === 'confirmado' && new Date(ag.data_agendada) >= new Date())
    .slice(0, 3);

  return (
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
            <h1 className={`font-bold text-gray-900 flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              <TrendingUp className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
              Dashboard do Prestador
            </h1>
            <p className={`text-gray-600 flex items-center gap-1 ${isMobile ? 'text-sm' : ''}`}>
              {planoPremium?.ativo && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
              {planoPremium?.ativo ? 'Prestador Premium' : 'Prestador Padrão'}
            </p>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Serviços Realizados
                  </p>
                  <p className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                    {stats.totalServicos}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Valor Recebido
                  </p>
                  <p className={`font-bold text-green-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                    R$ {stats.valorRecebido.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Nota Média
                  </p>
                  <p className={`font-bold text-yellow-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                    {stats.notaMedia.toFixed(1)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Avaliações
                  </p>
                  <p className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                    {stats.avaliacoes}
                  </p>
                </div>
                <Star className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Premium */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Status Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            {planoPremium?.ativo ? (
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                    ✨ Prestador Premium Ativo
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Premium desde: {new Date(planoPremium.desde).toLocaleDateString()}
                  </p>
                  {planoPremium.expira_em && (
                    <p className="text-sm text-gray-600">
                      Expira em: {new Date(planoPremium.expira_em).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button onClick={() => navigate('/plano-premium')}>
                  Gerenciar Plano
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-2">
                    Upgrade para Premium e tenha acesso a recursos exclusivos!
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Destaque nos resultados de busca</li>
                    <li>• Mais fotos no portfólio</li>
                    <li>• Estatísticas avançadas</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => navigate('/plano-premium')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Ativar Premium
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grid de Conteúdo */}
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {/* Próximos Agendamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Próximos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proximosAgendamentos.length > 0 ? (
                <div className="space-y-3">
                  {proximosAgendamentos.map((agendamento) => (
                    <div key={agendamento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">
                          {agendamento.servico?.nome}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(agendamento.data_agendada).toLocaleDateString()} às {agendamento.hora_agendada}
                        </p>
                        <p className="text-xs text-gray-500">
                          Cliente: {agendamento.solicitante?.nome}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {agendamento.status}
                      </Badge>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => navigate('/pedidos')}
                  >
                    Ver Todos os Agendamentos
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum agendamento próximo</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bairros Atendidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Bairros Atendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bairros.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {bairros.slice(0, 6).map((bairro) => (
                      <Badge key={bairro.id} variant="secondary">
                        {bairro.bairro}
                      </Badge>
                    ))}
                    {bairros.length > 6 && (
                      <Badge variant="outline">
                        +{bairros.length - 6} mais
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => navigate('/configuracoes')}
                  >
                    Gerenciar Bairros
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">Nenhum bairro configurado</p>
                  <Button onClick={() => navigate('/configuracoes')}>
                    Adicionar Bairros
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrestadorDashboard;
