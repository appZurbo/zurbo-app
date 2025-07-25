
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, MessageCircle, CheckCircle, Star, Shield, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import AuthButton from '@/components/auth/AuthModalHelper';

const ComoFunciona = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  const stepsPrestador = [
    {
      icon: <CheckCircle className="h-8 w-8 text-orange-500" />,
      title: "1. Cadastre-se",
      description: "Crie sua conta como prestador e complete seu perfil com informações profissionais"
    },
    {
      icon: <Star className="h-8 w-8 text-orange-500" />,
      title: "2. Defina seus serviços",
      description: "Adicione os serviços que oferece, preços e área de atendimento"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-orange-500" />,
      title: "3. Receba pedidos",
      description: "Clientes interessados entrarão em contato através da plataforma"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,
      title: "4. Realize o serviço",
      description: "Execute o trabalho com qualidade e receba o pagamento"
    }
  ];

  const stepsCliente = [
    {
      icon: <Search className="h-8 w-8 text-blue-500" />,
      title: "1. Busque o serviço",
      description: "Use nossos filtros para encontrar o profissional ideal na sua região"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
      title: "2. Entre em contato",
      description: "Converse diretamente com o prestador e tire suas dúvidas"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
      title: "3. Contrate o serviço",
      description: "Agende e confirme os detalhes do serviço"
    },
    {
      icon: <Star className="h-8 w-8 text-blue-500" />,
      title: "4. Avalie",
      description: "Depois do serviço, deixe sua avaliação para outros usuários"
    }
  ];

  return (
    <UnifiedLayout>
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-6xl mx-auto p-6'}`}>
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
              Como Funciona o ZURBO
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Entenda como nossa plataforma conecta clientes e prestadores
            </p>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Simples, Rápido e Seguro
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nossa plataforma foi criada para facilitar a conexão entre quem precisa de serviços e quem os oferece.
          </p>
        </div>

        {/* Para Clientes */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-blue-600">
            Para Clientes
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stepsCliente.map((step, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {step.icon}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Para Prestadores */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-orange-600">
            Para Prestadores
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stepsPrestador.map((step, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {step.icon}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Segurança */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Segurança em Primeiro Lugar</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Verificação de Prestadores</h4>
                <p className="text-gray-600">Todos os prestadores passam por um processo de verificação antes de se tornarem ativos na plataforma.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sistema de Avaliações</h4>
                <p className="text-gray-600">Avaliações reais de clientes ajudam você a escolher os melhores profissionais.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Chat Seguro</h4>
                <p className="text-gray-600">Toda comunicação acontece dentro da plataforma, garantindo sua privacidade.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Suporte 24/7</h4>
                <p className="text-gray-600">Nossa equipe está sempre disponível para ajudar em caso de problemas.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Pronto para começar?</h3>
          <div className="flex gap-4 justify-center">
            <AuthButton className="bg-blue-500 hover:bg-blue-600">
              Buscar Serviços
            </AuthButton>
            <AuthButton className="bg-orange-500 hover:bg-orange-600">
              Oferecer Serviços
            </AuthButton>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default ComoFunciona;
