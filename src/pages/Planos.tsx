
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Crown, 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield, 
  TrendingUp,
  Users,
  MessageCircle,
  Calendar,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useToast } from '@/hooks/use-toast';

const Planos = () => {
  const navigate = useNavigate();
  const { profile, isPrestador } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const isPremium = profile?.premium || false;

  const plans = {
    cliente: [
      {
        id: 'cliente-basico',
        name: 'Básico',
        price: { monthly: 0, yearly: 0 },
        description: 'Para uso pessoal básico',
        features: [
          'Buscar prestadores',
          'Ver avaliações',
          'Chat básico',
          'Suporte por email'
        ],
        limitations: [
          'Máximo 3 conversas por mês',
          'Sem prioridade no suporte',
          'Anúncios limitados'
        ],
        popular: false,
        current: !isPremium
      },
      {
        id: 'cliente-pro',
        name: 'PRO',
        price: { monthly: 19.90, yearly: 199.90 },
        description: 'Para clientes que querem o melhor',
        features: [
          'Tudo do plano Básico',
          'Conversas ilimitadas',
          'Suporte prioritário',
          'Sem anúncios',
          'Relatórios de gastos',
          'Desconto em serviços'
        ],
        limitations: [],
        popular: true,
        current: isPremium && !isPrestador
      }
    ],
    prestador: [
      {
        id: 'prestador-basico',
        name: 'Básico',
        price: { monthly: 0, yearly: 0 },
        description: 'Para começar como prestador',
        features: [
          'Perfil básico',
          'Receber pedidos',
          'Chat básico',
          '5 fotos no portfólio'
        ],
        limitations: [
          'Máximo 10 pedidos por mês',
          'Sem destaque nos resultados',
          'Suporte limitado'
        ],
        popular: false,
        current: !isPremium && isPrestador
      },
      {
        id: 'prestador-pro',
        name: 'PRO',
        price: { monthly: 39.90, yearly: 399.90 },
        description: 'Para prestadores profissionais',
        features: [
          'Tudo do plano Básico',
          'Pedidos ilimitados',
          'Destaque nos resultados',
          'Badge PRO verificado',
          'Portfólio ilimitado',
          'Estatísticas detalhadas',
          'Suporte prioritário',
          'Anúncios patrocinados'
        ],
        limitations: [],
        popular: true,
        current: isPremium && isPrestador
      },
      {
        id: 'prestador-premium',
        name: 'Premium',
        price: { monthly: 79.90, yearly: 799.90 },
        description: 'Para prestadores de elite',
        features: [
          'Tudo do plano PRO',
          'Selo Premium Elite',
          'Prioridade máxima',
          'Gerente de conta dedicado',
          'Marketing personalizado',
          'Análises avançadas',
          'API para integração'
        ],
        limitations: [],
        popular: false,
        current: false
      }
    ]
  };

  const currentPlans = isPrestador ? plans.prestador : plans.cliente;

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    
    if (planId.includes('basico')) {
      toast({
        title: "Plano Básico",
        description: "Você já está no plano básico gratuito!",
      });
      return;
    }

    // Mock payment process
    toast({
      title: "Redirecionando para pagamento",
      description: "Em breve você será redirecionado para finalizar sua assinatura PRO.",
    });
    
    // Here would integrate with actual payment system
    setTimeout(() => {
      toast({
        title: "Pagamento simulado",
        description: "Esta é uma demonstração. Em produção, integraria com sistema de pagamento real.",
        variant: "destructive"
      });
    }, 2000);
  };

  const PlanCard = ({ plan }) => {
    const isCurrentPlan = plan.current;
    const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
    const savingPercent = billingCycle === 'yearly' ? Math.round((1 - plan.price.yearly / (plan.price.monthly * 12)) * 100) : 0;

    return (
      <Card 
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
          plan.popular 
            ? 'border-2 border-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50' 
            : 'border border-gray-200 hover:border-orange-300'
        } ${
          isCurrentPlan ? 'ring-2 ring-green-500' : ''
        }`}
        style={plan.popular ? {
          boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)',
          border: '2px solid #f59e0b'
        } : {}}
      >
        {plan.popular && (
          <div className="absolute top-0 left-0 right-0">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-center py-2 font-medium">
              <Sparkles className="inline h-4 w-4 mr-1" />
              MAIS POPULAR
            </div>
          </div>
        )}
        
        {isCurrentPlan && (
          <div className="absolute top-0 right-0">
            <Badge className="bg-green-500 text-white rounded-none rounded-bl-lg">
              <Check className="h-3 w-3 mr-1" />
              Atual
            </Badge>
          </div>
        )}

        <CardHeader className={`text-center ${plan.popular ? 'pt-16' : 'pt-6'}`}>
          <div className="flex items-center justify-center mb-2">
            {plan.id.includes('pro') && (
              <Crown className="h-6 w-6 text-yellow-500 mr-2" />
            )}
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold">
                R$ {price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-gray-500 ml-1">
                /{billingCycle === 'yearly' ? 'ano' : 'mês'}
              </span>
            </div>
            
            {billingCycle === 'yearly' && savingPercent > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Economize {savingPercent}%
              </Badge>
            )}
          </div>
          
          <p className="text-gray-600 mt-2">{plan.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-3 flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Recursos inclusos
            </h4>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {plan.limitations.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                <X className="h-4 w-4 mr-2" />
                Limitações
              </h4>
              <ul className="space-y-2">
                {plan.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start">
                    <X className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            onClick={() => handleSelectPlan(plan.id)}
            disabled={isCurrentPlan}
            className={`w-full ${
              plan.popular 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' 
                : 'bg-orange-500 hover:bg-orange-600'
            } ${isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isCurrentPlan ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Plano Atual
              </>
            ) : plan.price.monthly === 0 ? (
              'Manter Gratuito'
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                Assinar {plan.name}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <UnifiedHeader />
      <div className={`min-h-screen bg-gradient-to-b from-orange-50 to-white ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-6' : 'max-w-7xl mx-auto p-8'}`}>
          {/* Header */}
          <div className="text-center mb-12">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
              <Crown className="h-8 w-8 text-white" />
            </div>
            
            <h1 className={`font-bold text-gray-900 mb-4 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>
              Planos PRO
            </h1>
            <p className={`text-gray-600 mb-8 max-w-2xl mx-auto ${isMobile ? 'text-base' : 'text-xl'}`}>
              {isPrestador 
                ? 'Destaque-se como prestador profissional e aumente seus ganhos'
                : 'Tenha acesso completo à plataforma com recursos premium'
              }
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Label htmlFor="billing-toggle" className={billingCycle === 'monthly' ? 'font-semibold' : ''}>
                Mensal
              </Label>
              <Switch
                id="billing-toggle"
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <Label htmlFor="billing-toggle" className={billingCycle === 'yearly' ? 'font-semibold' : ''}>
                Anual
              </Label>
              {billingCycle === 'yearly' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Economize até 17%
                </Badge>
              )}
            </div>
          </div>

          {/* Plans Grid */}
          <div className={`grid gap-8 mb-12 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {currentPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-center mb-8">
              Por que escolher PRO?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">Sem Limites</h3>
                <p className="text-sm text-gray-600">
                  Acesso ilimitado a todos os recursos da plataforma
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Suporte Prioritário</h3>
                <p className="text-sm text-gray-600">
                  Atendimento dedicado com resposta em até 2 horas
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Badge Verificado</h3>
                <p className="text-sm text-gray-600">
                  Destaque especial com selo PRO verificado
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Mais Visibilidade</h3>
                <p className="text-sm text-gray-600">
                  Apareça primeiro nos resultados de busca
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Dúvidas Frequentes</h2>
            <p className="text-gray-600 mb-6">
              Precisa de ajuda? Entre em contato conosco!
            </p>
            <Button variant="outline" onClick={() => navigate('/contato')}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Falar com Suporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planos;
