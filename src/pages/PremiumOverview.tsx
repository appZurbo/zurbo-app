
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Calendar, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';

export const PremiumOverview = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isMobile = useMobile();

  // Mock premium data - in real app, this would come from database
  const premiumData = {
    planName: 'Premium Plus',
    expirationDate: '2025-12-31',
    sosUsageLimit: 10,
    sosUsageRemaining: 7,
    benefits: [
      'Destaque nos resultados de busca',
      'Atendimento prioritário',
      'Relatórios avançados',
      'SOS ilimitado',
      'Badge premium no perfil'
    ]
  };

  if (!profile?.premium) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <Crown className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold mb-4">Você não possui um plano Premium</h2>
              <p className="text-gray-600 mb-6">
                Adquira um plano Premium para acessar recursos exclusivos e impulsionar seu negócio!
              </p>
              <Button onClick={() => navigate('/planos')} className="bg-yellow-500 hover:bg-yellow-600">
                Ver Planos Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                  Meu Plano Premium
                </h1>
                <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                  Gerencie sua assinatura Premium
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Status do Plano
              <Badge className="bg-yellow-100 text-yellow-800">Ativo</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800">Plano Atual</h3>
                <p className="text-2xl font-bold text-yellow-600">{premiumData.planName}</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">Expira em</h3>
                <p className="text-lg font-bold text-blue-600">
                  {new Date(premiumData.expirationDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">SOS Restantes</h3>
                <p className="text-2xl font-bold text-green-600">
                  {premiumData.sosUsageRemaining}/{premiumData.sosUsageLimit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Benefícios Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {premiumData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => navigate('/planos')}>
            <Calendar className="h-4 w-4 mr-2" />
            Renovar Plano
          </Button>
          <Button variant="outline" onClick={() => navigate('/configuracoes')}>
            <Crown className="h-4 w-4 mr-2" />
            Configurações Premium
          </Button>
        </div>
      </div>
    </div>
  );
};
