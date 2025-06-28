
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { useMobile } from '@/hooks/useMobile';

const Planos = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  const planos = [
    {
      nome: "Básico",
      preco: "Grátis",
      periodo: "para sempre",
      cor: "gray",
      features: [
        "Perfil básico",
        "Até 3 fotos no portfólio",
        "Receber avaliações",
        "Chat básico",
        "Suporte por email"
      ]
    },
    {
      nome: "PRO",
      preco: "R$ 29,90",
      periodo: "por mês",
      cor: "orange",
      popular: true,
      features: [
        "Tudo do plano Básico",
        "Destaque nos resultados",
        "Até 20 fotos no portfólio",
        "Estatísticas avançadas",
        "Suporte prioritário",
        "Badge PRO",
        "Impulsionar perfil"
      ]
    },
    {
      nome: "Premium",
      preco: "R$ 49,90",
      periodo: "por mês",
      cor: "purple",
      features: [
        "Tudo do plano PRO",
        "Aparecer no topo sempre",
        "Portfólio ilimitado",
        "Analytics completos",
        "Suporte 24/7",
        "Badge Premium",
        "Anúncios personalizados"
      ]
    }
  ];

  const getCardStyle = (cor: string, popular?: boolean) => {
    if (popular) {
      return "border-2 border-orange-500 shadow-lg scale-105";
    }
    return "border border-gray-200";
  };

  const getButtonStyle = (cor: string) => {
    switch (cor) {
      case "orange":
        return "bg-orange-500 hover:bg-orange-600";
      case "purple":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <UnifiedLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {!isMobile && 'Voltar'}
          </Button>
          <div>
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
              Planos e Preços
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Escolha o plano ideal para seu negócio
            </p>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Potencialize seu negócio
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Com nossos planos premium, você tem acesso a ferramentas exclusivas 
            para conquistar mais clientes e fazer seu negócio crescer.
          </p>
        </div>

        {/* Planos */}
        <div className={`grid gap-8 mb-12 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
          {planos.map((plano, index) => (
            <Card key={index} className={`relative ${getCardStyle(plano.cor, plano.popular)}`}>
              {plano.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plano.nome}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plano.preco}</span>
                  <span className="text-gray-500 ml-2">{plano.periodo}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plano.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${getButtonStyle(plano.cor)}`}
                  onClick={() => navigate('/auth')}
                >
                  {plano.preco === "Grátis" ? "Começar Grátis" : "Assinar Agora"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Resumida */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Dúvidas sobre os planos?</h3>
          <p className="text-gray-600 mb-6">
            Nossa equipe está pronta para te ajudar a escolher o melhor plano para seu negócio.
          </p>
          <Button 
            variant="outline"
            onClick={() => navigate('/informacoes#ajuda')}
          >
            Central de Ajuda
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default Planos;
