import React from 'react';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/useMobile';
import { Rocket } from 'lucide-react';
import WatermarkSection from '@/components/sections/WatermarkSection';

const Planos = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  const planos = [
    {
      id: 'basic',
      nome: 'Plano Básico',
      preco: 'Grátis',
      recursos: [
        'Acesso limitado a serviços',
        'Suporte básico',
      ],
      acao: 'Começar',
      destaque: false,
    },
    {
      id: 'premium',
      nome: 'Plano Premium',
      preco: 'R$ 29,90/mês',
      recursos: [
        'Acesso ilimitado a serviços',
        'Suporte prioritário',
        'Recursos avançados',
      ],
      acao: 'Assinar',
      destaque: true,
    },
  ];

  return (
    <UnifiedLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <div className={`${isMobile ? 'px-4 py-8' : 'max-w-4xl mx-auto px-6 py-12'}`}>
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold text-gray-900 mb-4 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
              Escolha o Plano Ideal para Você
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Desbloqueie o máximo de funcionalidades e aproveite ao máximo nossa plataforma.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {planos.map((plano) => (
              <Card key={plano.id} className={`${plano.destaque ? 'border-2 border-orange-500 shadow-xl' : 'shadow'} transition-shadow duration-300 hover:shadow-lg`}>
                <CardHeader className="text-center">
                  <CardTitle className={`text-2xl font-semibold ${plano.destaque ? 'text-orange-600' : 'text-gray-900'}`}>
                    {plano.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className={`text-4xl font-bold ${plano.destaque ? 'text-orange-700' : 'text-gray-800'}`}>
                      {plano.preco}
                    </span>
                    {plano.preco !== 'Grátis' && <span className="text-gray-500">/mês</span>}
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {plano.recursos.map((recurso, index) => (
                      <li key={index}>{recurso}</li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plano.destaque ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => navigate('/premium')}
                  >
                    {plano.acao}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Precisa de um plano personalizado? <a href="/central-ajuda" className="text-orange-500 hover:underline">Entre em contato conosco</a>.
            </p>
          </div>
        </div>
      </div>
      
      <WatermarkSection />
    </UnifiedLayout>
  );
};

export default Planos;
