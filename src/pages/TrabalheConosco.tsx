import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, MapPin, Clock, Star, Wrench, ArrowRight, Smartphone, Calendar, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import WatermarkSection from '@/components/sections/WatermarkSection';

const TrabalheConosco = () => {
  const navigate = useNavigate();
  
  const beneficios = [{
    icon: Users,
    titulo: "Clientes Qualificados",
    descricao: "Conecte-se com clientes que realmente precisam dos seus serviços"
  }, {
    icon: MapPin,
    titulo: "Área de Atuação Flexível",
    descricao: "Defina os bairros onde você quer trabalhar"
  }, {
    icon: Clock,
    titulo: "Horários Flexíveis",
    descricao: "Você define quando quer trabalhar"
  }, {
    icon: Star,
    titulo: "Sistema de Avaliações",
    descricao: "Construa sua reputação com avaliações reais"
  }, {
    icon: Smartphone,
    titulo: "App Mobile Completo",
    descricao: "Gerencie tudo pelo celular"
  }, {
    icon: Calendar,
    titulo: "Agenda Inteligente",
    descricao: "Organize seus agendamentos facilmente"
  }];
  
  const comoFunciona = [{
    numero: "01",
    titulo: "Cadastre-se",
    descricao: "Crie seu perfil e adicione seus serviços"
  }, {
    numero: "02",
    titulo: "Receba Pedidos",
    descricao: "Clientes interessados entram em contato"
  }, {
    numero: "03",
    titulo: "Negocie",
    descricao: "Converse com o cliente e acerte os detalhes"
  }, {
    numero: "04",
    titulo: "Execute",
    descricao: "Realize o serviço com qualidade"
  }, {
    numero: "05",
    titulo: "Receba",
    descricao: "Seja avaliado e receba seu pagamento"
  }];
  
  const servicos = ["Limpeza", "Jardinagem", "Pintura", "Elétrica", "Encanamento", "Construção", "Beleza", "Informática", "Educação", "Saúde", "Transporte", "Eventos"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <UnifiedHeader />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-0 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mx-0 text-center px-[5px]">
              Trabalhe Conosco
            </h1>
          </div>
          
          <p className="md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-xl font-normal">
            Conecte-se com milhares de clientes em Sinop e região. Cresça seu faturamento com a primeira plataforma feita para serviços
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-6">
              <Wrench className="mr-2 h-5 w-5" />
              Cadastrar-se agora como Prestador
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="px-4 bg-white py-[15px]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher o Zurbo?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beneficios.map((beneficio, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <beneficio.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{beneficio.titulo}</h3>
                  <p className="text-gray-600">{beneficio.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {comoFunciona.map((passo, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {passo.numero}
                </div>
                <h3 className="text-lg font-semibold mb-2">{passo.titulo}</h3>
                <p className="text-gray-600 text-sm">{passo.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços Disponíveis */}
      <section className="px-4 bg-white py-[15px]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Muitos Serviços Disponíveis</h2>
          
          <div className="flex flex-wrap justify-center gap-3">
            {servicos.map((servico, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                {servico}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de prestadores que já confiam no Zurbo para fazer seus negócios crescerem.
          </p>
          
          <Button size="lg" onClick={() => navigate('/auth')} className="bg-white text-orange-600 hover:bg-gray-50 py-[10px] text-left text-sm px-[11px]">
            <Wrench className="mr-2 h-5 w-5" />
            Cadastrar-se agora como Prestador
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <WatermarkSection />
    </div>
  );
};

export default TrabalheConosco;
