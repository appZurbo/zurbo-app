
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Crown, Star, Camera, Shield, Zap, Gift, Users, CheckCircle, Sparkles, Heart, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ModernFooter } from '@/components/layout/ModernFooter';

export default function Planos() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'usuario' | 'prestador'>('usuario');

  const handleAssinatura = (tipo: 'usuario' | 'prestador', plano: 'premium') => {
    toast({
      title: "Assinatura Premium",
      description: `Em breve você poderá assinar o plano Premium ${tipo === 'usuario' ? 'de Cliente' : 'de Prestador'} via Pix. Funcionalidade em desenvolvimento!`
    });
  };

  const usuarioPlanos = [
    {
      id: 'normal',
      nome: 'Plano Normal',
      preco: 'Grátis',
      cor: 'green',
      icone: Users,
      beneficios: [
        'Solicitar serviços ilimitados',
        'Avaliar prestadores',
        'Acesso ao chat',
        'Adicionar prestadores aos favoritos',
        '3 usos/mês do serviço de emergência'
      ]
    },
    {
      id: 'premium',
      nome: 'Premium Cliente',
      preco: 'R$ 9,90/mês',
      cor: 'blue',
      icone: Crown,
      beneficios: [
        'Tudo do plano Normal',
        'Suporte prioritário',
        'Cupons exclusivos de desconto',
        '5 usos/mês do serviço de emergência com prioridade',
        'Participação em sorteios mensais',
        'Acesso a prestadores Premium verificados'
      ]
    }
  ];

  const prestadorPlanos = [
    {
      id: 'normal',
      nome: 'Plano Normal',
      preco: 'Grátis',
      cor: 'green',
      icone: Users,
      beneficios: [
        'Cadastrar até 3 serviços',
        'Receber solicitações',
        'Exibir até 4 fotos na galeria',
        'Avaliações básicas',
        'Página de perfil padrão'
      ]
    },
    {
      id: 'premium',
      nome: 'Premium Prestador',
      preco: 'R$ 39,90/mês',
      cor: 'orange',
      icone: Crown,
      beneficios: [
        'Tudo do plano Normal',
        'Exibir até 10 fotos no portfólio',
        'Destaque nas buscas (prioridade nos filtros)',
        'Página de perfil estendida',
        'Selo "Prestador Premium" no cartão',
        'Participação em promoções internas',
        'Destaque nas campanhas da Zurbo'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-[10px]">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
          
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Planos <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Premium</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha o plano ideal para você e aproveite ao máximo a plataforma Zurbo
            </p>
          </div>
        </div>

        {/* Seletor de Tipo de Usuário */}
        <div className="flex justify-center mb-8">
          <Tabs value={selectedPlan} onValueChange={value => setSelectedPlan(value as 'usuario' | 'prestador')} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
              <TabsTrigger value="usuario" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <Heart className="h-4 w-4" />
                Sou Cliente
              </TabsTrigger>
              <TabsTrigger value="prestador" className="flex items-center gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
                <Shield className="h-4 w-4" />
                Sou Prestador
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={selectedPlan} onValueChange={value => setSelectedPlan(value as 'usuario' | 'prestador')}>
          {/* Planos para Cliente */}
          <TabsContent value="usuario" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Planos para Clientes
              </h2>
              <p className="text-gray-600">
                Encontre e contrate os melhores profissionais com facilidade
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {usuarioPlanos.map(plano => {
                const IconComponent = plano.icone;
                const isPremium = plano.id === 'premium';
                return (
                  <Card key={plano.id} className={`relative ${isPremium ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                    {isPremium && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Recomendado
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 ${isPremium ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className={`h-8 w-8 ${isPremium ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <CardTitle className={`text-2xl ${isPremium ? 'text-blue-700' : 'text-gray-900'}`}>
                        {plano.nome}
                      </CardTitle>
                      <div className="text-3xl font-bold text-gray-900 mt-2">
                        {plano.preco}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {plano.beneficios.map((beneficio, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className={`h-5 w-5 mt-0.5 ${isPremium ? 'text-blue-500' : 'text-green-500'}`} />
                            <span className="text-gray-700">{beneficio}</span>
                          </div>
                        ))}
                      </div>
                      
                      {isPremium && (
                        <div className="pt-4">
                          <Button 
                            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white" 
                            onClick={() => handleAssinatura('usuario', 'premium')}
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Assinar Premium
                          </Button>
                          <p className="text-center text-sm text-gray-500 mt-2">
                            Pagamento via Pix (em breve)
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Planos para Prestador */}
          <TabsContent value="prestador" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Planos para Prestadores
              </h2>
              <p className="text-gray-600">
                Destaque-se da concorrência e alcance mais clientes
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {prestadorPlanos.map(plano => {
              const IconComponent = plano.icone;
              const isPremium = plano.id === 'premium';
              return <Card key={plano.id} className={`relative ${isPremium ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50 ring-2 ring-orange-200' : 'border-gray-200'}`}>
                    {isPremium && <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Recomendado
                        </Badge>
                      </div>}
                    
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 ${isPremium ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className={`h-8 w-8 ${isPremium ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <CardTitle className={`text-2xl ${isPremium ? 'text-orange-700' : 'text-gray-900'}`}>
                        {plano.nome}
                      </CardTitle>
                      <div className="text-3xl font-bold text-gray-900 mt-2">
                        {plano.preco}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {plano.beneficios.map((beneficio, index) => <div key={index} className="flex items-start gap-3">
                            <CheckCircle className={`h-5 w-5 mt-0.5 ${isPremium ? 'text-orange-500' : 'text-green-500'}`} />
                            <span className="text-gray-700">{beneficio}</span>
                          </div>)}
                      </div>
                      
                      {isPremium && <div className="pt-4">
                          <Button className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white" onClick={() => handleAssinatura('prestador', 'premium')}>
                            <Crown className="h-4 w-4 mr-2" />
                            Assinar Premium
                          </Button>
                          <p className="text-center text-sm text-gray-500 mt-2">
                            Pagamento via Pix (em breve)
                          </p>
                        </div>}
                    </CardContent>
                  </Card>;
            })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Seção de Benefícios Detalhados */}
        <section className="mt-16 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o Premium?
            </h2>
            <p className="text-gray-600">
              Recursos exclusivos que fazem toda a diferença
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Suporte Prioritário</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Atendimento preferencial com tempo de resposta reduzido para resolver suas dúvidas rapidamente.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Serviço de Emergência</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acesso prioritário a profissionais verificados para situações urgentes, com mais usos mensais.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">Benefícios Exclusivos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Cupons de desconto, participação em sorteios e acesso a promoções especiais.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Como funciona o pagamento?</h3>
                <p className="text-gray-600">
                  Em breve você poderá pagar via Pix de forma rápida e segura. Por enquanto, a funcionalidade está em desenvolvimento.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
                <p className="text-gray-600">
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Os benefícios são cumulativos?</h3>
                <p className="text-gray-600">
                  Sim, ao assinar o Premium você mantém todos os benefícios do plano gratuito e ganha os extras.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Há desconto para pagamento anual?</h3>
                <p className="text-gray-600">
                  Sim! Oferecemos descontos especiais para assinaturas anuais. Entre em contato para saber mais.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <ModernFooter />
    </div>
  );
}
