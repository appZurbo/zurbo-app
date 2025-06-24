
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Users, Target, Heart, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/useMobile';

const SobreNos = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
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
              Sobre o ZURBO
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Conectando você aos melhores profissionais
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-3xl">Z</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Revolucionando a forma como você encontra serviços
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            O ZURBO nasceu da necessidade de conectar pessoas que precisam de serviços com profissionais qualificados de forma rápida, segura e confiável.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid gap-6 mb-12 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Nossa Missão</h3>
              <p className="text-gray-600">
                Facilitar o acesso a serviços de qualidade, conectando clientes e prestadores de forma eficiente e segura.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Lightbulb className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Nossa Visão</h3>
              <p className="text-gray-600">
                Ser a principal plataforma de serviços do Brasil, reconhecida pela qualidade e confiança.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Nossos Valores</h3>
              <p className="text-gray-600">
                Transparência, qualidade, segurança e compromisso com a satisfação de nossos usuários.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-orange-500" />
              Nossa História
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                O ZURBO foi criado em 2024 com o objetivo de simplificar a busca por profissionais qualificados. 
                Percebemos que tanto clientes quanto prestadores de serviços enfrentavam dificuldades para se conectar 
                de forma eficiente e segura.
              </p>
              <p className="text-gray-700 mb-4">
                Nossa plataforma foi desenvolvida pensando na experiência do usuário, oferecendo ferramentas 
                intuitivas para busca, contratação e avaliação de serviços. Priorizamos a segurança e a qualidade 
                em todas as interações.
              </p>
              <p className="text-gray-700">
                Hoje, o ZURBO conecta milhares de clientes a prestadores de serviços qualificados em diversas 
                categorias, desde limpeza e reparos até beleza e jardinagem. Continuamos crescendo e inovando 
                para atender melhor às necessidades de nossa comunidade.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Faça parte da nossa comunidade</h3>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Cadastre-se como Cliente
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/auth')}
            >
              Seja um Prestador
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobreNos;
