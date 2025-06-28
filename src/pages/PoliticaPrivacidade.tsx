import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ModernFooter } from '@/components/layout/ModernFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock, Database, Settings, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PoliticaPrivacidade() {
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
            <p className="text-gray-600 text-lg">
              Sua privacidade é nossa prioridade
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Última atualização: 21 de junho de 2024
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                1. Compromisso com sua Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                No Zurbo, respeitamos profundamente sua privacidade e estamos comprometidos 
                em proteger suas informações pessoais. Esta política explica como coletamos, 
                usamos, compartilhamos e protegemos suas informações quando você usa nossa plataforma.
              </p>
              <p>
                Suas informações pessoais (como nome, CPF, email e localização) são utilizadas 
                exclusivamente para melhorar sua experiência na plataforma e conectá-lo com 
                prestadores de serviços adequados às suas necessidades.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                2. Informações que Coletamos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4 className="font-semibold text-gray-900">Informações fornecidas por você:</h4>
              <ul>
                <li>Nome completo e informações de perfil</li>
                <li>Email e número de telefone</li>
                <li>CPF (para verificação de identidade)</li>
                <li>Endereço e localização (para conectar com prestadores próximos)</li>
                <li>Fotos de perfil e portfólio (para prestadores)</li>
                <li>Avaliações e comentários</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-6">Informações coletadas automaticamente:</h4>
              <ul>
                <li>Dados de uso da plataforma</li>
                <li>Informações do dispositivo e navegador</li>
                <li>Endereço IP e dados de localização</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                3. Como Usamos suas Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>Utilizamos suas informações para:</p>
              <ul>
                <li>Criar e manter sua conta na plataforma</li>
                <li>Conectar clientes com prestadores adequados</li>
                <li>Processar transações e pagamentos</li>
                <li>Enviar notificações importantes sobre serviços</li>
                <li>Melhorar nossos serviços e funcionalidades</li>
                <li>Prevenir fraudes e garantir segurança</li>
                <li>Cumprir obrigações legais</li>
                <li>Enviar comunicações promocionais (com seu consentimento)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-500" />
                4. Compartilhamento de Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                <strong>Nunca vendemos suas informações pessoais para terceiros.</strong> 
                Podemos compartilhar informações apenas nas seguintes situações:
              </p>
              <ul>
                <li>Com prestadores de serviços, quando necessário para a prestação do serviço</li>
                <li>Com parceiros de pagamento, para processar transações</li>
                <li>Com autoridades legais, quando exigido por lei</li>
                <li>Em caso de fusão ou aquisição da empresa</li>
                <li>Com seu consentimento explícito</li>
              </ul>
              
              <p className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mt-4">
                <strong>Importante:</strong> Informações do seu perfil público (nome, foto, avaliações) 
                são visíveis para outros usuários da plataforma para facilitar a escolha de serviços.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-500" />
                5. Proteção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>Implementamos diversas medidas de segurança para proteger suas informações:</p>
              <ul>
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Armazenamento seguro em servidores protegidos</li>
                <li>Acesso restrito às informações pessoais</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Auditorias regulares de segurança</li>
                <li>Backup seguro de dados</li>
              </ul>
              
              <p>
                Apesar de todos os esforços, nenhum sistema é 100% seguro. 
                Comprometemo-nos a notificá-lo imediatamente em caso de qualquer 
                violação de dados que possa afetar suas informações.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Seus Direitos</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>Você tem os seguintes direitos sobre suas informações pessoais:</p>
              <ul>
                <li><strong>Acesso:</strong> Solicitar cópia de todas as informações que temos sobre você</li>
                <li><strong>Correção:</strong> Corrigir informações incorretas ou incompletas</li>
                <li><strong>Exclusão:</strong> Solicitar a exclusão de suas informações pessoais</li>
                <li><strong>Portabilidade:</strong> Transferir suas informações para outro serviço</li>
                <li><strong>Oposição:</strong> Opor-se ao processamento de suas informações</li>
                <li><strong>Limitação:</strong> Limitar como processamos suas informações</li>
              </ul>
              
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mt-4">
                <p className="mb-2">
                  <strong>Para exercer seus direitos:</strong>
                </p>
                <ul className="mb-0">
                  <li>Acesse as configurações da sua conta</li>
                  <li>Entre em contato: privacidade@zurbo.com.br</li>
                  <li>Telefone: (11) 9999-9999</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Cookies e Tecnologias Similares</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência:
              </p>
              <ul>
                <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento da plataforma</li>
                <li><strong>Cookies de desempenho:</strong> Ajudam a melhorar nossos serviços</li>
                <li><strong>Cookies de personalização:</strong> Lembram suas preferências</li>
                <li><strong>Cookies de marketing:</strong> Usados para publicidade relevante (opcional)</li>
              </ul>
              
              <p>
                Você pode gerenciar suas preferências de cookies nas configurações do 
                seu navegador ou através das nossas configurações de privacidade.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Retenção de Dados</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Mantemos suas informações pessoais apenas pelo tempo necessário para:
              </p>
              <ul>
                <li>Fornecer nossos serviços</li>
                <li>Cumprir obrigações legais</li>
                <li>Resolver disputas</li>
                <li>Fazer cumprir nossos acordos</li>
              </ul>
              
              <p>
                Quando você exclui sua conta, removemos suas informações pessoais, 
                exceto quando exigido por lei ou para proteção de direitos legítimos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Alterações nesta Política</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Podemos atualizar esta Política de Privacidade ocasionalmente. 
                Notificaremos você sobre mudanças significativas através de:
              </p>
              <ul>
                <li>Email para o endereço cadastrado</li>
                <li>Notificação na plataforma</li>
                <li>Aviso em nosso site</li>
              </ul>
              
              <p>
                Recomendamos que revise esta política periodicamente para se manter 
                informado sobre como protegemos suas informações.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contato</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Para dúvidas sobre privacidade ou para exercer seus direitos:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="mb-0">
                  <li><strong>Email:</strong> privacidade@zurbo.com.br</li>
                  <li><strong>Telefone:</strong> (11) 9999-9999</li>
                  <li><strong>Endereço:</strong> São Paulo, SP, Brasil</li>
                  <li><strong>Horário:</strong> Segunda a sexta, 9h às 18h</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Sua confiança é fundamental para nós. Estamos sempre trabalhando para 
            proteger sua privacidade da melhor forma possível.
          </p>
          <Link to="/">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Voltar ao Zurbo
            </Button>
          </Link>
        </div>
      </main>

      <ModernFooter />
    </div>
  );
}
