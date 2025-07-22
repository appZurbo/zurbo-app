import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Shield, FileText, Users, HelpCircle, Target, Heart, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedDock } from '@/components/mobile/UnifiedDock';

const InformacoesUnificada = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  return (
    <div>
      <UnifiedHeader />
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate('/')} className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && 'Voltar'}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                    Informações & Sobre
                  </h1>
                  <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                    Tudo sobre o ZURBO e nossas políticas
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="sobre" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="sobre" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {!isMobile && 'Sobre'}
                  </TabsTrigger>
                  <TabsTrigger value="regras" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {!isMobile && 'Regras'}
                  </TabsTrigger>
                  <TabsTrigger value="termos" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {!isMobile && 'Termos'}
                  </TabsTrigger>
                  <TabsTrigger value="privacidade" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {!isMobile && 'Privacidade'}
                  </TabsTrigger>
                  <TabsTrigger value="como-funciona" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    {!isMobile && 'Como Funciona'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sobre" className="p-6">
                  <div className="space-y-8">
                    {/* Hero Section */}
                    <div className="text-center">
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
                    <div className="grid gap-6 md:grid-cols-3">
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
                    <Card>
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                          <Users className="h-6 w-6 text-orange-500" />
                          Nossa História
                        </h3>
                        <div className="prose prose-gray max-w-none space-y-4">
                          <p className="text-gray-700">
                            O ZURBO foi criado em 2025 com o objetivo de simplificar a busca por profissionais qualificados. Percebemos que tanto clientes quanto prestadores de serviços enfrentavam dificuldades para se conectar de forma eficiente e segura.
                          </p>
                          <p className="text-gray-700">
                            Nossa plataforma foi desenvolvida pensando na experiência do usuário, oferecendo ferramentas intuitivas para busca, contratação e avaliação de serviços. Priorizamos a segurança e a qualidade em todas as interações.
                          </p>
                          <p className="text-gray-700">
                            Hoje, o ZURBO conecta milhares de clientes a prestadores de serviços qualificados em diversas categorias, desde limpeza, cuidados e reparos até beleza e jardinagem. Continuamos crescendo e inovando para atender melhor às necessidades de nossa comunidade.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Call to Action */}
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-4">Faça parte da nossa comunidade</h3>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={() => navigate('/auth')} className="bg-orange-500 hover:bg-orange-600">
                          Cadastre-se como Cliente
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/auth')}>
                          Seja um Prestador
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="regras" className="p-6">
                  
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Regras da Comunidade</h2>
                      <div className="space-y-4 text-gray-700">
                        <section>
                          <h3 className="text-lg font-semibold mb-2">1. Respeito Mútuo</h3>
                          <p>Todos os usuários devem tratar uns aos outros com respeito e cortesia. Não toleramos discriminação, assédio ou linguagem ofensiva.</p>
                        </section>
                        
                        <section>
                          <h3 className="text-lg font-semibold mb-2">2. Qualidade dos Serviços</h3>
                          <p>Prestadores devem fornecer serviços de qualidade conforme acordado. Clientes devem fornecer informações precisas sobre suas necessidades. Podemos intermediar a situação em casos necessários.</p>
                        </section>
                        
                        <section>
                          <h3 className="text-lg font-semibold mb-2">3. Comunicação Transparente</h3>
                          <p>Mantenha toda comunicação clara e honesta. Discuta preços, prazos e expectativas antes de iniciar qualquer serviço.</p>
                        </section>

                        <section>
                          <h3 className="text-lg font-semibold mb-2">4. Segurança</h3>
                          <p>Não compartilhe informações pessoais sensíveis. Use sempre os canais oficiais da plataforma para comunicação inicial.</p>
                        </section>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="termos" className="p-6">
                  
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Termos de Uso</h2>
                      <div className="space-y-4 text-gray-700">
                        <section>
                          <h3 className="text-lg font-semibold mb-2">1. Aceitação dos Termos</h3>
                          <p>Ao usar a plataforma Zurbo, você concorda com estes termos de uso e nossa política de privacidade.</p>
                        </section>
                        
                        <section>
                          <h3 className="text-lg font-semibold mb-2">2. Responsabilidades do Usuário</h3>
                          <p>Você é responsável por manter sua conta segura e por todas as atividades realizadas em sua conta.</p>
                        </section>
                        
                        <section>
                          <h3 className="text-lg font-semibold mb-2">3. Uso da Plataforma</h3>
                          <p>A plataforma deve ser usada apenas para fins legítimos de contratação e prestação de serviços.</p>
                        </section>

                        <section>
                          <h3 className="text-lg font-semibold mb-2">4. Limitação de Responsabilidade</h3>
                          <p>A Zurbo atua como intermediário entre clientes e prestadores. Não somos responsáveis pela qualidade ou execução dos serviços.</p>
                        </section>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="privacidade" className="p-6">
                  
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Política de Privacidade</h2>
                      <div className="space-y-4 text-gray-700">
                        <section>
                          <h3 className="text-lg font-semibold mb-2">1. Coleta de Dados</h3>
                          <p>Coletamos apenas as informações necessárias para fornecer nossos serviços, como nome, email, localização e informações de perfil.</p>
                        </section>
                        
                        <section>
                          <h3 className="text-lg font-semibold mb-2">2. Uso dos Dados</h3>
                          <p>Seus dados são usados para conectar clientes e prestadores, processar pagamentos e melhorar nossos serviços.</p>
                        </section>
                        
                        <section>
                          <h3 className="text-lg font-semibold mb-2">3. Compartilhamento</h3>
                          <p>Não vendemos ou compartilhamos seus dados pessoais com terceiros, exceto quando necessário para fornecer nossos serviços.</p>
                        </section>

                        <section>
                          <h3 className="text-lg font-semibold mb-2">4. Segurança</h3>
                          <p>Implementamos medidas de segurança adequadas para proteger seus dados contra acesso não autorizado.</p>
                        </section>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="como-funciona" className="p-6">
                  
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Como Funciona</h2>
                      <div className="space-y-6">
                        <section>
                          <h3 className="text-xl font-semibold mb-3 text-orange-600">Para Clientes</h3>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">1</div>
                              <div>
                                <h4 className="font-semibold">Busque Prestadores</h4>
                                <p className="text-gray-600">Use nossa busca para encontrar prestadores na sua região ou por tipo de serviço</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">2</div>
                              <div>
                                <h4 className="font-semibold">Entre em Contato</h4>
                                <p className="text-gray-600">Converse diretamente com o prestador através do chat</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">3</div>
                              <div>
                                <h4 className="font-semibold">Agende o Serviço</h4>
                                <p className="text-gray-600">Defina data, horário e detalhes do serviço</p>
                              </div>
                            </div>
                          </div>
                        </section>

                        <section>
                          <h3 className="text-xl font-semibold mb-3 text-blue-600">Para Prestadores</h3>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                              <div>
                                <h4 className="font-semibold">Crie seu Perfil</h4>
                                <p className="text-gray-600">Complete seu cadastro com fotos e descrição dos serviços</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                              <div>
                                <h4 className="font-semibold">Receba Solicitações</h4>
                                <p className="text-gray-600">Clientes interessados entrarão em contato com você</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                              <div>
                                <h4 className="font-semibold">Execute o Serviço</h4>
                                <p className="text-gray-600">Realize o trabalho com qualidade e receba sua avaliação</p>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      {isMobile && <UnifiedDock />}
    </div>
  );
};

export default InformacoesUnificada;
