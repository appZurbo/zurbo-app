
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MessageCircle, Star, TrendingUp, Users, Eye, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

const PrestadorDashboard = () => {
  const navigate = useNavigate();
  const { profile, isPrestador, loading } = useAuth();
  const isMobile = useMobile();

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

  // Mock data para o dashboard
  const stats = {
    pedidosAtivos: 12,
    avaliacaoMedia: 4.8,
    totalGanhos: 2450.00,
    visualizacoes: 1543
  };

  return (
    <div>
      <UnifiedHeader />
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-6xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate('/')} className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && 'Voltar'}
            </Button>
            
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

          {/* Estatísticas */}
          <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Pedidos Ativos</p>
                    <p className="text-2xl font-bold">{stats.pedidosAtivos}</p>
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
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Este Mês</p>
                    <p className="text-lg font-bold">R$ {stats.totalGanhos.toFixed(2)}</p>
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

          {/* Ações Rápidas */}
          <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/agenda-prestador')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Agenda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Gerencie seus horários e agendamentos</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/conversas')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  Conversas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Converse com seus clientes</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/configuracoes')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Edite suas informações e serviços</p>
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
                  </div>
                  <Button 
                    onClick={() => navigate('/planos')}
                    className="bg-white text-yellow-600 hover:bg-gray-50"
                  >
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
