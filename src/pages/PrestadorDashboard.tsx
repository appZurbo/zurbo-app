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
  Clock,
  Eye
} from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

const PrestadorDashboard = () => {
  const navigate = useNavigate();
  const { profile, isPrestador, loading } = useAuth();
  const isMobile = useMobile();
  const [stats, setStats] = useState({
    totalServicos: 24,
    valorRecebido: 3250.80,
    avaliacoes: 18,
    notaMedia: 4.8
  });

  // Dados fake para próximos agendamentos
  const proximosAgendamentos = [
    {
      id: '1',
      servico: 'Instalação Elétrica',
      data: '2024-01-22',
      hora: '14:00',
      cliente: 'Pedro Costa',
      status: 'confirmado'
    },
    {
      id: '2',
      servico: 'Reparo Encanamento',
      data: '2024-01-23',
      hora: '09:30',
      cliente: 'Maria Silva',
      status: 'confirmado'
    },
    {
      id: '3',
      servico: 'Pintura Quarto',
      data: '2024-01-24',
      hora: '15:00',
      cliente: 'João Santos',
      status: 'pendente'
    }
  ];

  const bairrosAtendidos = [
    'Vila Madalena', 'Pinheiros', 'Jardins', 'Moema', 'Itaim Bibi'
  ];

  if (loading) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !isPrestador) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Esta página é exclusiva para prestadores de serviços.
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
                {profile.premium && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
                {profile.premium ? 'Prestador Premium' : 'Prestador Padrão'}
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
              {profile.premium ? (
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                      ✨ Prestador Premium Ativo
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Acesso a recursos exclusivos e destaque nos resultados
                    </p>
                  </div>
                  <Button onClick={() => navigate('/planos')}>
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
                    onClick={() => navigate('/planos')}
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
            {/* Próximos Agendamentos com botão Ver Agenda Completa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Próximos Agendamentos
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/agenda-prestador')}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Ver Agenda Completa
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {proximosAgendamentos.length > 0 ? (
                  <div className="space-y-3">
                    {proximosAgendamentos.slice(0, 3).map((agendamento) => (
                      <div key={agendamento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">
                            {agendamento.servico}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(agendamento.data).toLocaleDateString()} às {agendamento.hora}
                          </p>
                          <p className="text-xs text-gray-500">
                            Cliente: {agendamento.cliente}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {agendamento.status}
                        </Badge>
                      </div>
                    ))}
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
                {bairrosAtendidos.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {bairrosAtendidos.slice(0, 6).map((bairro) => (
                        <Badge key={bairro} variant="secondary">
                          {bairro}
                        </Badge>
                      ))}
                      {bairrosAtendidos.length > 6 && (
                        <Badge variant="outline">
                          +{bairrosAtendidos.length - 6} mais
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
    </div>
  );
};

export default PrestadorDashboard;
