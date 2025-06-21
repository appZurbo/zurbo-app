
import { ModernHeader } from '@/components/layout/ModernHeader';
import { ModernFooter } from '@/components/layout/ModernFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Star, Camera, MapPin, TrendingUp, Users, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlanoPremium() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Plano <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Premium</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Destaque-se da concorrência e alcance mais clientes com benefícios exclusivos 
              do plano Premium do Zurbo
            </p>
          </div>
        </div>

        {/* Hero Premium */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="bg-white/20 text-white border-0 mb-4">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Exclusivo para Prestadores
                  </Badge>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Transforme seu perfil em uma máquina de clientes
                  </h2>
                  
                  <p className="text-yellow-100 text-lg mb-6">
                    Com o plano Premium, você ganha visibilidade extra, mais recursos 
                    para mostrar seu trabalho e ferramentas avançadas para crescer seu negócio.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-50">
                      Começar Grátis por 7 dias
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Ver demonstração
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">+300%</div>
                        <div className="text-sm text-yellow-100">Mais visualizações</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-8">
                      <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">+500%</div>
                        <div className="text-sm text-yellow-100">Mais contatos</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 col-span-2">
                      <CardContent className="p-4 text-center">
                        <Crown className="h-8 w-8 mx-auto mb-2" />
                        <div className="text-lg font-bold">Selo Premium Exclusivo</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Comparação Gratuito vs Premium */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gratuito vs Premium
            </h2>
            <p className="text-gray-600">
              Veja a diferença que o plano Premium faz no seu negócio
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Plano Gratuito */}
            <Card className="border-gray-200">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle>Plano Gratuito</CardTitle>
                <p className="text-gray-600">Funcionalidades básicas</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Perfil básico</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Até 5 fotos no portfólio</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Listagem padrão</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Avaliações de clientes</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Chat básico</span>
                </div>
              </CardContent>
            </Card>

            {/* Plano Premium */}
            <Card className="border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Recomendado
                </Badge>
              </div>
              
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-yellow-700">Plano Premium</CardTitle>
                <p className="text-yellow-600">Recursos avançados para profissionais</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Tudo do plano gratuito +</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-500" />
                  <span>Até <strong>50 fotos</strong> no portfólio</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-500" />
                  <span><strong>Selo Premium</strong> no perfil</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-500" />
                  <span><strong>Prioridade</strong> nas buscas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-500" />
                  <span>Destaque em <strong>carrosséis</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-500" />
                  <span>Área de cobertura <strong>expandida</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-500" />
                  <span>Estatísticas <strong>avançadas</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-500" />
                  <span>Suporte <strong>prioritário</strong></span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recursos Detalhados */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recursos Premium em Detalhes
            </h2>
            <p className="text-gray-600">
              Cada recurso foi pensado para alavancar seu negócio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Portfólio Expandido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Mostre até 50 fotos dos seus melhores trabalhos, organizadas em 
                  categorias com títulos e descrições personalizadas.
                </p>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  Gratuito: 5 fotos | Premium: 50 fotos
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">Selo de Destaque</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Ganhe credibilidade com o selo Premium exclusivo que aparece 
                  em destaque no seu perfil e nas listagens.
                </p>
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Selo Premium
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Prioridade nas Buscas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Apareça sempre no topo dos resultados de busca, aumentando 
                  significativamente suas chances de ser encontrado.
                </p>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  +300% mais visualizações
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Destaques Especiais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Apareça em carrosséis especiais na página inicial e seções 
                  de destaque, aumentando sua visibilidade.
                </p>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                  Exposição premium
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Área Expandida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Defina múltiplas áreas de atendimento e apareça em buscas 
                  de diferentes regiões e bairros.
                </p>
                <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                  Cobertura ampliada
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Suporte VIP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Suporte prioritário com tempo de resposta reduzido e canal 
                  exclusivo para usuários Premium.
                </p>
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                  Atendimento prioritário
                </Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Preços */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Preços Transparentes
            </h2>
            <p className="text-gray-600">
              Investimento que se paga com o aumento de clientes
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <Card className="border-yellow-300  bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Plano Premium</CardTitle>
                <div className="text-4xl font-bold text-yellow-600 mt-4">
                  R$ 49<span className="text-lg font-normal text-gray-600">/mês</span>
                </div>
                <p className="text-gray-600 mt-2">
                  ou R$ 490/ano (2 meses grátis)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge className="bg-green-100 text-green-700 mb-4">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    7 dias grátis para testar
                  </Badge>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white" size="lg">
                  Começar teste grátis
                </Button>
                
                <p className="text-center text-sm text-gray-600">
                  Cancele a qualquer momento. Sem compromisso.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              O que dizem nossos usuários Premium
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Com o Premium, meus clientes triplicaram em 2 meses. 
                    O investimento se pagou na primeira semana!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {i === 1 ? 'CM' : i === 2 ? 'RS' : 'MF'}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {i === 1 ? 'Carlos M.' : i === 2 ? 'Rosa S.' : 'Marcos F.'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {i === 1 ? 'Pintor' : i === 2 ? 'Diarista' : 'Jardineiro'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">
                Pronto para se destacar?
              </h2>
              <p className="text-orange-100 text-lg mb-6 max-w-2xl mx-auto">
                Junte-se a centenas de profissionais que já transformaram 
                seus negócios com o plano Premium do Zurbo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-50">
                  <Crown className="h-4 w-4 mr-2" />
                  Começar teste grátis
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Falar com especialista
                </Button>
              </div>
              
              <p className="text-orange-100 text-sm mt-4">
                ✓ Sem compromisso ✓ Cancele quando quiser ✓ Suporte incluído
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <ModernFooter />
    </div>
  );
}
