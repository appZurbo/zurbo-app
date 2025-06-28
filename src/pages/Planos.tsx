
import { useState } from 'react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Crown, Star, CheckCircle, Zap, Shield, MessageCircle, Camera, TrendingUp, Clock, Users, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Planos() {
  const [selectedUserType, setSelectedUserType] = useState<'cliente' | 'prestador'>('cliente');

  const clientPlans = [
    {
      name: 'Básico',
      price: 'Gratuito',
      description: 'Para uso pessoal básico',
      features: [
        'Busca por prestadores',
        'Chat básico com prestadores', 
        '3 usos do botão SOS por mês',
        'Avaliações simples',
        'Suporte por email'
      ],
      color: 'gray',
      buttonText: 'Plano Atual',
      buttonVariant: 'outline' as const
    },
    {
      name: 'PRO',
      price: 'R$ 9,90/mês',
      description: 'Para quem precisa de mais recursos',
      features: [
        'Prioridade no atendimento',
        'Chat PRO com suporte',
        '7 usos do botão SOS por mês',
        'Histórico completo de serviços',
        'Suporte prioritário via WhatsApp',
        'Agendamentos ilimitados',
        'Notificações push personalizadas'
      ],
      color: 'blue',
      buttonText: 'Assinar PRO',
      buttonVariant: 'default' as const,
      popular: true
    }
  ];

  const prestadorPlans = [
    {
      name: 'Básico',
      price: 'Gratuito',
      description: 'Para começar como prestador',
      features: [
        'Perfil básico',
        'Até 4 fotos no portfólio',
        'Receber pedidos',
        'Chat com clientes',
        'Avaliações de clientes'
      ],
      color: 'gray',
      buttonText: 'Plano Atual',
      buttonVariant: 'outline' as const
    },
    {
      name: 'PRO',
      price: 'R$ 39,90/mês',
      description: 'Para profissionais que querem se destacar',
      features: [
        'Até 20 fotos no portfólio',
        'Prioridade na exibição dos resultados',
        'Selo PRO exclusivo',
        'Destaque em carrosséis especiais',
        'Área de cobertura expandida',
        'Estatísticas avançadas de performance',
        'Suporte prioritário',
        'Marketing personalizado'
      ],
      color: 'yellow',
      buttonText: 'Assinar PRO',
      buttonVariant: 'default' as const,
      popular: true
    }
  ];

  const currentPlans = selectedUserType === 'cliente' ? clientPlans : prestadorPlans;

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Planos <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">PRO</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha o plano ideal para o seu perfil e aproveite todos os benefícios exclusivos
            </p>
          </div>
        </div>

        {/* Seleção de Tipo de Usuário */}
        <div className="mb-12">
          <Tabs value={selectedUserType} onValueChange={(value) => setSelectedUserType(value as 'cliente' | 'prestador')} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto h-12">
              <TabsTrigger value="cliente" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Sou Cliente
              </TabsTrigger>
              <TabsTrigger value="prestador" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Sou Prestador
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Planos */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {currentPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${
                plan.popular 
                  ? plan.color === 'blue' 
                    ? 'border-2 border-blue-500 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50' 
                    : 'border-2 border-yellow-500 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className={`${
                    plan.color === 'blue' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  } px-3 py-1`}>
                    <Star className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 ${
                  plan.color === 'gray' 
                    ? 'bg-gray-100' 
                    : plan.color === 'blue'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                } rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {plan.color === 'gray' ? (
                    <Users className="h-6 w-6 text-gray-600" />
                  ) : (
                    <Crown className="h-6 w-6 text-white" />
                  )}
                </div>
                <CardTitle className={plan.color === 'yellow' ? 'text-yellow-700' : ''}>{plan.name}</CardTitle>
                <div className={`text-3xl font-bold mb-2 ${
                  plan.color === 'blue' ? 'text-blue-600' : 
                  plan.color === 'yellow' ? 'text-yellow-600' : 
                  'text-gray-600'
                }`}>
                  {plan.price}
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className={`h-4 w-4 flex-shrink-0 ${
                        plan.color === 'blue' ? 'text-blue-500' :
                        plan.color === 'yellow' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.buttonVariant}
                  className={`w-full mt-6 ${
                    plan.popular 
                      ? plan.color === 'blue'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
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

        {/* Recursos Detalhados por Tipo */}
        {selectedUserType === 'cliente' ? (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Benefícios PRO para Clientes
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Prioridade no Atendimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Seja atendido primeiro pelos prestadores e tenha respostas mais rápidas aos seus pedidos.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">SOS Emergência PRO</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    7 usos por mês do botão SOS para emergências (vs 3 no plano gratuito).
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Suporte VIP</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Suporte prioritário via WhatsApp com tempo de resposta reduzido.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        ) : (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Benefícios PRO para Prestadores
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Camera className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Portfólio Expandido</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Até 20 fotos no seu portfólio (vs 4 no plano gratuito) para mostrar melhor seus trabalhos.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-lg">Prioridade na Busca</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Apareça sempre no topo dos resultados e em carrosséis especiais na página inicial.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Crown className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">Selo PRO</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Selo exclusivo PRO que aumenta a confiança dos clientes no seu perfil.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* CTA Final */}
        <section className="text-center">
          <Card className={`${
            selectedUserType === 'cliente' 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
              : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
          } text-white border-0`}>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">
                Pronto para começar?
              </h2>
              <p className={`${
                selectedUserType === 'cliente' ? 'text-blue-100' : 'text-yellow-100'
              } text-lg mb-6 max-w-2xl mx-auto`}>
                {selectedUserType === 'cliente' 
                  ? 'Tenha prioridade no atendimento e acesso a recursos exclusivos.'
                  : 'Destaque-se da concorrência e aumente seus ganhos com o plano PRO.'
                }
              </p>
              
              <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-50">
                <Crown className="h-4 w-4 mr-2" />
                Começar teste grátis
              </Button>
              
              <p className={`${
                selectedUserType === 'cliente' ? 'text-blue-100' : 'text-yellow-100'
              } text-sm mt-4`}>
                ✓ Sem compromisso ✓ Cancele quando quiser ✓ Suporte incluído
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
