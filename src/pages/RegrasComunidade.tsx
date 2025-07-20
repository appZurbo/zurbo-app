import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import WatermarkSection from '@/components/sections/WatermarkSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Heart, Shield, AlertTriangle, CheckCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegrasComunidade() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Regras da Comunidade</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Construindo juntos uma comunidade respeitosa, segura e colaborativa para todos
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Heart className="h-5 w-5" />
                Nossa Missão Comunitária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 leading-relaxed">
                O Zurbo é mais que uma plataforma - somos uma comunidade que conecta pessoas 
                através de serviços de qualidade. Estas regras garantem que todos tenham uma 
                experiência positiva, segura e respeitosa.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                1. Respeito e Cortesia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Faça isso:</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Trate todos com gentileza e respeito</li>
                    <li>• Use linguagem educada e profissional</li>
                    <li>• Seja paciente com dúvidas e esclarecimentos</li>
                    <li>• Reconheça bom trabalho com avaliações positivas</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Evite:</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Linguagem ofensiva ou discriminatória</li>
                    <li>• Comentários sobre raça, religião ou orientação</li>
                    <li>• Ameaças ou intimidação</li>
                    <li>• Harassment ou perseguição</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                2. Honestidade e Transparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Para Prestadores:</h4>
                <ul className="text-blue-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500" />
                    Mantenha informações de perfil verdadeiras e atualizadas
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500" />
                    Seja transparente sobre preços, prazos e condições
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500" />
                    Use fotos reais do seu trabalho no portfólio
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500" />
                    Comunique mudanças ou imprevistos rapidamente
                  </li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-3">Para Clientes:</h4>
                <ul className="text-purple-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-purple-500" />
                    Descreva claramente o serviço que precisa
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-purple-500" />
                    Seja realista sobre prazos e orçamento
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-purple-500" />
                    Forneça informações precisas sobre localização
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-purple-500" />
                    Cumpra acordos financeiros estabelecidos
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-orange-500" />
                3. Comunicação Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Avaliações e Comentários</h4>
                  <ul className="text-orange-700 text-sm space-y-1">
                    <li>• Seja honesto e construtivo em suas avaliações</li>
                    <li>• Base seus comentários em experiências reais</li>
                    <li>• Evite avaliações por vingança ou interesse pessoal</li>
                    <li>• Foque no serviço prestado, não na pessoa</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Comunicação Direta</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Responda mensagens em tempo hábil</li>
                    <li>• Seja claro e objetivo na comunicação</li>
                    <li>• Mantenha conversas relacionadas ao serviço</li>
                    <li>• Use os canais oficiais da plataforma</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                4. Condutas Proibidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800 font-medium mb-3">
                  As seguintes condutas podem resultar em advertência, suspensão ou banimento:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-red-800 mb-2">Conteúdo Inadequado:</h5>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Conteúdo ofensivo ou enganoso</li>
                      <li>• Informações falsas no perfil</li>
                      <li>• Fotos inadequadas ou de terceiros</li>
                      <li>• Spam ou conteúdo repetitivo</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-red-800 mb-2">Comportamento Inadequado:</h5>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Criar múltiplas contas</li>
                      <li>• Manipular avaliações</li>
                      <li>• Solicitar contato externo imediatamente</li>
                      <li>• Usar a plataforma para fins não relacionados</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Resolução de Conflitos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Quando surgirem problemas, siga estas etapas:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <div>
                    <h4 className="font-medium">Comunicação Direta</h4>
                    <p className="text-sm text-gray-600">
                      Tente resolver amigavelmente através de conversa respeitosa
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <div>
                    <h4 className="font-medium">Documentação</h4>
                    <p className="text-sm text-gray-600">
                      Mantenha registros da conversa e evidências do problema
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <div>
                    <h4 className="font-medium">Suporte Zurbo</h4>
                    <p className="text-sm text-gray-600">
                      Entre em contato conosco para mediação e suporte
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Sistema de Penalidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <h4 className="font-semibold text-yellow-800">Advertência</h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      Notificação sobre comportamento inadequado
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <h4 className="font-semibold text-orange-800">Suspensão</h4>
                    <p className="text-xs text-orange-700 mt-1">
                      Bloqueio temporário da conta
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <h4 className="font-semibold text-red-800">Banimento</h4>
                    <p className="text-xs text-red-700 mt-1">
                      Exclusão permanente da plataforma
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Denúncias e Suporte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Precisa reportar algum problema?
                </h4>
                
                <div className="space-y-2 text-blue-700">
                  <p className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <strong>Email:</strong> suporte@zurbo.com.br
                  </p>
                  <p className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <strong>Telefone:</strong> (11) 9999-9999
                  </p>
                  <p className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <strong>Chat:</strong> Disponível 24/7 na plataforma
                  </p>
                </div>
                
                <p className="text-blue-600 text-sm mt-3">
                  Nossa equipe responde em até 24 horas e trata todas as denúncias com seriedade e confidencialidade.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Juntos, construímos uma comunidade melhor! 🤝
          </h3>
          <p className="text-gray-600 mb-6">
            Suas ações fazem a diferença. Vamos manter o Zurbo um lugar seguro e acolhedor para todos.
          </p>
          <Link to="/">
            <Button className="bg-green-500 hover:bg-green-600">
              Voltar ao Zurbo
            </Button>
          </Link>
        </div>
      </main>

      <WatermarkSection />
    </div>
  );
}
