
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Calendar, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useMobile } from '@/hooks/useMobile';

const PremiumOverview = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isMobile = useMobile();

  // Mock data - in real app, this would come from database
  const premiumData = {
    planType: 'Premium Mensal',
    expirationDate: '15/02/2024',
    sosUsagesRemaining: 3,
    sosUsagesTotal: 5,
    features: [
      'Prioridade nos resultados de busca',
      'Badge Premium visível',
      'Suporte prioritário',
      'Relatórios avançados',
      '5 SOS por mês'
    ]
  };

  if (!profile || profile.plano_premium !== 'ativo') {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Crown className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-semibold mb-2">Acesso Premium Necessário</h3>
              <p className="text-gray-600 mb-4">
                Você precisa ser um usuário Premium para acessar esta página.
              </p>
              <Button onClick={() => navigate('/planos')} className="w-full bg-orange-500 hover:bg-orange-600">
                Ver Planos Premium
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
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
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
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                    Meu Plano Premium
                  </h1>
                  <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                    Visão geral do seu plano ativo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Status Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-orange-500" />
                Status do Plano
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Plano Atual</h3>
                  <Badge className="bg-orange-500 text-white">
                    {premiumData.planType}
                  </Badge>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Vence em</h3>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{premiumData.expirationDate}</span>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Status</h3>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-700">Ativo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SOS Usage Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-red-500" />
                Uso do SOS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">SOS Restantes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {premiumData.sosUsagesRemaining}/{premiumData.sosUsagesTotal}
                  </p>
                </div>
                <div className="w-20 h-20 relative">
                  <div className="w-full h-full bg-gray-200 rounded-full"></div>
                  <div 
                    className="absolute top-0 left-0 w-full h-full bg-red-500 rounded-full"
                    style={{
                      clipPath: `conic-gradient(from 0deg, transparent ${360 * (1 - premiumData.sosUsagesRemaining / premiumData.sosUsagesTotal)}deg, red 0deg)`
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{Math.round((premiumData.sosUsagesRemaining / premiumData.sosUsagesTotal) * 100)}%</span>
                  </div>
                </div>
              </div>
              
              {premiumData.sosUsagesRemaining <= 1 && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">
                    Poucos SOS restantes! Renove seu plano para continuar aproveitando.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Benefícios Premium Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {premiumData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button 
                  onClick={() => navigate('/planos')} 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Renovar ou Alterar Plano
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PremiumOverview;
