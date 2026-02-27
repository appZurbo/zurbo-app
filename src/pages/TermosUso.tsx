import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import WatermarkSection from '@/components/sections/WatermarkSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Users, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermosUso() {
  return (
    <div className="min-h-screen bg-white">
      <UnifiedHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-orange-500/20">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-[-0.03em] leading-[1.1]">Termos de Uso</h1>
            <p className="text-gray-500 text-lg font-medium">
              Última atualização: 21 de junho de 2024
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                1. Aceitação dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Ao utilizar a plataforma Zurbo, você concorda expressamente com estes Termos de Uso.
                Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
              </p>
              <p>
                O Zurbo é uma plataforma digital que conecta clientes e prestadores de serviços de forma
                rápida, segura e eficiente. Nossa missão é facilitar o encontro entre pessoas que
                precisam de serviços e profissionais qualificados.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
                <Users className="h-6 w-6 text-orange-500" />
                2. Responsabilidades dos Usuários
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4 className="font-semibold text-gray-900">Para Clientes:</h4>
              <ul>
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Tratar prestadores com respeito e cortesia</li>
                <li>Cumprir acordos financeiros estabelecidos</li>
                <li>Avaliar prestadores de forma honesta e construtiva</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-6">Para Prestadores:</h4>
              <ul>
                <li>Manter perfil profissional atualizado com informações reais</li>
                <li>Prestar serviços com qualidade e no prazo acordado</li>
                <li>Ser transparente sobre preços e condições</li>
                <li>Responder prontamente às solicitações de clientes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                3. Uso Adequado da Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>É estritamente proibido:</p>
              <ul>
                <li>Publicar conteúdo falso, enganoso ou ofensivo</li>
                <li>Usar a plataforma para atividades ilegais</li>
                <li>Criar múltiplas contas ou perfis falsos</li>
                <li>Tentar contornar medidas de segurança</li>
                <li>Usar linguagem discriminatória ou inadequada</li>
                <li>Solicitar ou oferecer serviços ilegais</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <CardHeader>
              <CardTitle className="text-xl font-bold tracking-tight">4. Pagamentos e Transações</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                O Zurbo facilita a conexão entre clientes e prestadores, mas não é responsável
                pelos acordos financeiros estabelecidos entre as partes. Recomendamos:
              </p>
              <ul>
                <li>Definir claramente o escopo e preço do serviço antes de iniciar</li>
                <li>Usar métodos de pagamento seguros</li>
                <li>Documentar acordos importantes</li>
                <li>Utilizar o sistema de avaliações da plataforma</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Propriedade Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Todo o conteúdo da plataforma Zurbo, incluindo design, textos, logotipos e
                funcionalidades, é de propriedade exclusiva da empresa ou de seus licenciadores.
              </p>
              <p>
                Os usuários mantêm os direitos sobre o conteúdo que publicam, mas concedem
                ao Zurbo licença para usar, exibir e distribuir esse conteúdo na plataforma.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Limitação de Responsabilidade</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                O Zurbo atua apenas como intermediário na conexão entre clientes e prestadores.
                Não nos responsabilizamos por:
              </p>
              <ul>
                <li>Qualidade dos serviços prestados</li>
                <li>Disputas entre usuários</li>
                <li>Danos diretos ou indiretos resultantes do uso da plataforma</li>
                <li>Conteúdo publicado por terceiros</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Modificações dos Termos</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento.
                Usuários serão notificados sobre mudanças significativas e o uso continuado
                da plataforma constituirá aceitação dos novos termos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Rescisão</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Podemos suspender ou encerrar contas que violem estes termos. Usuários podem
                encerrar suas contas a qualquer momento através das configurações da conta.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contato</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <ul>
                <li>Email: contato@zurbo.com.br</li>
                <li>Telefone: (66) 99914-5353</li>
                <li>Endereço: Sinop, MT, Brasil</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Ao continuar usando o Zurbo, você confirma que leu e concordou com estes termos.
          </p>
          <Link to="/">
            <Button className="bg-orange-500 hover:bg-orange-600 px-8 py-6 text-lg font-semibold rounded-2xl transform hover:scale-[1.05] transition-all duration-200 shadow-lg shadow-orange-500/10">
              Voltar ao Zurbo
            </Button>
          </Link>
        </div>
      </main>

      <WatermarkSection />
    </div>
  );
}
