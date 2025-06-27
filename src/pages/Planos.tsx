
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useMobile } from '@/hooks/useMobile';

const Planos = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  const plans = [
    {
      name: 'Básico',
      price: 'Gratuito',
      description: 'Para começar a usar a plataforma',
      features: [
        'Acesso à busca de prestadores',
        'Até 3 solicitações por mês',
        'Suporte por email',
        'Avaliações básicas'
      ],
      popular: false,
      buttonText: 'Plano Atual',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Premium',
      price: 'R$ 29,90/mês',
      description: 'Para quem precisa de mais recursos',
      features: [
        'Solicitações ilimitadas',
        'Prioridade no atendimento',
        'Suporte via chat',
        'Avaliações detalhadas',
        'Histórico completo',
        'Descontos especiais'
      ],
      popular: true,
      buttonText: 'Assinar Premium',
      buttonVariant: 'default' as const
    },
    {
      name: 'Prestador Premium',
      price: 'R$ 49,90/mês',
      description: 'Para prestadores profissionais',
      features: [
        'Perfil destacado',
        'Selo de verificação',
        'Prioridade nas buscas',
        'Portfólio ilimitado',
        'Analytics detalhadas',
        'Suporte prioritário',
        'Marketing personalizado'
      ],
      popular: false,
      buttonText: 'Tornar-se Premium',
      buttonVariant: 'default' as const
    }
  ];

  return (
    <div>
      <UnifiedHeader />
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-6xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && 'Voltar'}
            </Button>
            
            <div className="flex-1 text-center">
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                Planos e Preços
              </h1>
              <p className={`text-gray-600 mt-2 ${isMobile ? 'text-sm' : ''}`}>
                Escolha o plano ideal para suas necessidades
              </p>
            </div>
            <div className={`${isMobile ? 'w-10' : 'w-20'}`}></div>
          </div>

          {/* Plans Grid */}
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-orange-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="flex items-center justify-center gap-2">
                    {plan.name === 'Prestador Premium' && <Crown className="h-5 w-5 text-yellow-500" />}
                    {plan.name}
                  </CardTitle>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {plan.price}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.buttonVariant}
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                        : ''
                    }`}
                    disabled={plan.buttonText === 'Plano Atual'}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
            <div className="grid gap-4 max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
                  <p className="text-gray-600 text-sm">
                    Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Como funciona o período de teste?</h3>
                  <p className="text-gray-600 text-sm">
                    Oferecemos 7 dias gratuitos para todos os planos pagos. Você pode cancelar antes do fim do período sem cobrança.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Prestadores Premium aparecem primeiro?</h3>
                  <p className="text-gray-600 text-sm">
                    Sim, prestadores Premium têm prioridade nos resultados de busca e recebem o selo de verificação.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planos;
