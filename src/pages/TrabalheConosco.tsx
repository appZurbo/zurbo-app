
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Target, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { useMobile } from '@/hooks/useMobile';

const TrabalheConosco = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  return (
    <UnifiedLayout>
      <div className="max-w-4xl mx-auto">
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
              Trabalhe Conosco
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Junte-se à nossa equipe e faça a diferença
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-3xl">Z</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Construa o futuro dos serviços conosco
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            O ZURBO está crescendo e buscamos pessoas talentosas e apaixonadas por tecnologia e inovação.
          </p>
        </div>

        {/* Por que trabalhar conosco */}
        <div className="grid gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Equipe Incrível</h3>
              <p className="text-gray-600">
                Trabalhe com profissionais talentosos e colaborativos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Propósito</h3>
              <p className="text-gray-600">
                Faça parte de uma missão que conecta pessoas e facilita vidas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Crescimento</h3>
              <p className="text-gray-600">
                Desenvolva suas habilidades em uma empresa em expansão.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Benefícios</h3>
              <p className="text-gray-600">
                Pacote completo de benefícios e ambiente flexível.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Vagas em aberto */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vagas em Aberto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-lg">Desenvolvedor Full Stack</h4>
                <p className="text-gray-600 mb-2">React, Node.js, TypeScript</p>
                <p className="text-gray-500 text-sm">Remoto • Tempo integral</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-lg">Designer UX/UI</h4>
                <p className="text-gray-600 mb-2">Figma, Prototipagem, Design System</p>
                <p className="text-gray-500 text-sm">Remoto • Tempo integral</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-lg">Analista de Marketing Digital</h4>
                <p className="text-gray-600 mb-2">SEO, SEM, Analytics, Growth</p>
                <p className="text-gray-500 text-sm">Híbrido • Tempo integral</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Interessado em fazer parte da equipe?</h3>
          <p className="text-gray-600 mb-6">
            Envie seu currículo e portfólio para nós. Vamos adorar conhecer você!
          </p>
          <Button 
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => window.open('mailto:rh@zurbo.com?subject=Interesse em trabalhar no ZURBO')}
          >
            Enviar Currículo
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default TrabalheConosco;
