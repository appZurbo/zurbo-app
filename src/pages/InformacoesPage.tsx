
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  Users, 
  HelpCircle, 
  Search, 
  ChevronDown,
  MessageCircle,
  Phone,
  Mail,
  Target,
  Lightbulb,
  Heart,
  CheckCircle,
  Star,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { useMobile } from '@/hooks/useMobile';

const InformacoesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('como-funciona');

  // Set active tab based on URL hash
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['como-funciona', 'regras', 'termos', 'privacidade', 'ajuda'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

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

  const faqItems = [
    {
      category: "Conta e Cadastro",
      questions: [
        {
          question: "Como criar uma conta no ZURBO?",
          answer: "Para criar sua conta, clique em 'Entrar' no menu superior e depois em 'Cadastre-se'. Escolha se você é cliente ou prestador de serviços e preencha os dados solicitados."
        },
        {
          question: "Esqueci minha senha, como recuperar?",
          answer: "Na tela de login, clique em 'Esqueci minha senha'. Digite seu email e enviaremos um link para redefinir sua senha."
        },
        {
          question: "Como alterar informações do meu perfil?",
          answer: "Acesse 'Configurações' no menu e vá para a aba 'Perfil'. Lá você pode editar suas informações pessoais e profissionais."
        }
      ]
    },
    {
      category: "Para Clientes",
      questions: [
        {
          question: "Como encontrar um prestador de serviços?",
          answer: "Use a barra de busca na página inicial ou navegue pelas categorias. Você pode filtrar por localização, preço e avaliações."
        },
        {
          question: "Como entrar em contato com um prestador?",
          answer: "No perfil do prestador, clique em 'Conversar' para iniciar um chat direto ou use o botão 'Agendar Serviço'."
        },
        {
          question: "Como avaliar um serviço?",
          answer: "Após a conclusão do serviço, você receberá uma notificação para avaliá-lo. Acesse 'Meus Pedidos' e deixe sua avaliação."
        }
      ]
    },
    {
      category: "Para Prestadores",
      questions: [
        {
          question: "Como cadastrar meus serviços?",
          answer: "Nas configurações, vá para 'Serviços' e adicione os tipos de serviço que você oferece, com preços e descrições."
        },
        {
          question: "Como funciona o plano Premium?",
          answer: "O plano Premium oferece destaque nos resultados de busca, mais fotos no portfólio e estatísticas avançadas."
        },
        {
          question: "Como definir minha área de atendimento?",
          answer: "Em 'Configurações > Bairros', você pode adicionar os bairros onde atende e definir se cobra taxa de deslocamento."
        }
      ]
    }
  ];

  const filteredFAQ = faqItems.map(category => ({
    ...category,
    questions: category.questions.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
              Central de Informações
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Tudo que você precisa saber sobre o ZURBO
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} mb-8`}>
            <TabsTrigger value="como-funciona" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              {!isMobile && 'Como Funciona'}
              {isMobile && 'Como'}
            </TabsTrigger>
            <TabsTrigger value="regras" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {!isMobile && 'Regras'}
              {isMobile && 'Regras'}
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="termos" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Termos
                </TabsTrigger>
                <TabsTrigger value="privacidade" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacidade
                </TabsTrigger>
                <TabsTrigger value="ajuda" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Ajuda
                </TabsTrigger>
              </>
            )}
            {isMobile && (
              <TabsTrigger value="ajuda" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Ajuda
              </TabsTrigger>
            )}
          </TabsList>

          {/* Como Funciona Tab */}
          <TabsContent value="como-funciona" className="space-y-8">
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

            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Pronto para começar?</h3>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Buscar Serviços
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Oferecer Serviços
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Regras da Comunidade Tab */}
          <TabsContent value="regras" className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Regras da Comunidade</h2>
              <p className="text-gray-600 text-lg">
                Para manter um ambiente seguro e respeitoso para todos
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conduta Respeitosa</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Trate todos os usuários com respeito e cortesia</li>
                    <li>• Use linguagem apropriada em todas as comunicações</li>
                    <li>• Seja honesto nas descrições de serviços e avaliações</li>
                    <li>• Respeite prazos e compromissos assumidos</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo Proibido</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Conteúdo ofensivo, discriminatório ou inadequado</li>
                    <li>• Informações falsas ou enganosas</li>
                    <li>• Spam ou conteúdo promocional não relacionado</li>
                    <li>• Violação de direitos autorais ou propriedade intelectual</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Consequências</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    O descumprimento das regras pode resultar em advertências, 
                    suspensão temporária ou banimento permanente da plataforma.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Termos de Uso Tab (apenas desktop) */}
          {!isMobile && (
            <TabsContent value="termos" className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Termos de Uso</h2>
                <p className="text-gray-600 text-lg">
                  Última atualização: 21 de junho de 2024
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>1. Aceitação dos Termos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Ao utilizar a plataforma Zurbo, você concorda expressamente com estes Termos de Uso. 
                      O Zurbo é uma plataforma digital que conecta clientes e prestadores de serviços.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>2. Responsabilidades dos Usuários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Para Clientes:</h4>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Fornecer informações verdadeiras e atualizadas</li>
                          <li>• Tratar prestadores com respeito e cortesia</li>
                          <li>• Cumprir acordos financeiros estabelecidos</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Para Prestadores:</h4>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Manter perfil profissional atualizado</li>
                          <li>• Prestar serviços com qualidade e no prazo</li>
                          <li>• Ser transparente sobre preços e condições</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>3. Limitação de Responsabilidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      O Zurbo atua apenas como intermediário na conexão entre clientes e prestadores. 
                      Não nos responsabilizamos pela qualidade dos serviços prestados ou disputas entre usuários.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Política de Privacidade Tab (apenas desktop) */}
          {!isMobile && (
            <TabsContent value="privacidade" className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Política de Privacidade</h2>
                <p className="text-gray-600 text-lg">
                  Sua privacidade é nossa prioridade
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compromisso com sua Privacidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      No Zurbo, respeitamos profundamente sua privacidade e estamos comprometidos 
                      em proteger suas informações pessoais. Suas informações são utilizadas 
                      exclusivamente para melhorar sua experiência na plataforma.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Informações que Coletamos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Informações fornecidas por você:</h4>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Nome completo e informações de perfil</li>
                          <li>• Email e número de telefone</li>
                          <li>• CPF (para verificação de identidade)</li>
                          <li>• Endereço e localização</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Seus Direitos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Você tem direito de acessar, corrigir, excluir e transferir suas informações pessoais.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <p className="font-semibold mb-2">Para exercer seus direitos:</p>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Acesse as configurações da sua conta</li>
                        <li>• Entre em contato: privacidade@zurbo.com.br</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Central de Ajuda Tab */}
          <TabsContent value="ajuda" className="space-y-8">
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar na central de ajuda..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10" 
              />
            </div>

            {/* Contact Options */}
            <div className="grid gap-4 mb-8 md:grid-cols-3">
              <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Chat Online</h3>
                  <p className="text-sm text-gray-600">Fale conosco em tempo real</p>
                </CardContent>
              </Card>

              <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Mail className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-gray-600">contato@zurbo.com</p>
                </CardContent>
              </Card>

              <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Phone className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Telefone</h3>
                  <p className="text-sm text-gray-600">(11) 99999-9999</p>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Perguntas Frequentes</h2>
              
              {filteredFAQ.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">Nenhum resultado encontrado para "{searchTerm}"</p>
                    <Button variant="outline" onClick={() => setSearchTerm('')} className="mt-4">
                      Limpar busca
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredFAQ.map((category, categoryIndex) => (
                  <Card key={categoryIndex}>
                    <CardHeader>
                      <CardTitle>{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {category.questions.map((item, index) => (
                        <Collapsible key={index}>
                          <CollapsibleTrigger className="flex w-full items-center justify-between text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="font-medium">{item.question}</span>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-3 pb-3">
                            <p className="text-gray-600 mt-2">{item.answer}</p>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
};

export default InformacoesPage;
