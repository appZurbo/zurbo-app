
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Star, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SimplifiedLocalBannerImages } from '@/components/banners/SimplifiedLocalBannerImages';

export const HeroSection = () => {
  const [busca, setBusca] = useState('');
  const [cidade, setCidade] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    // Redirecionar para busca com parâmetros
    const searchParams = new URLSearchParams();
    if (busca) searchParams.set('servico', busca);
    if (cidade) searchParams.set('cidade', cidade);

    // Scroll para seção de resultados
    const resultsSection = document.getElementById('resultados');
    if (resultsSection) {
      resultsSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleComoFunciona = () => {
    const comoFuncionaSection = document.getElementById('como-funciona');
    if (comoFuncionaSection) {
      comoFuncionaSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 lg:py-24 overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo principal */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Encontre os
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> melhores</span>
                <br />
                profissionais
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Conecte-se com prestadores de serviços qualificados na sua região. 
                Rápido, seguro e com avaliações reais.
              </p>
            </div>

            {/* Barra de busca hero */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input 
                      placeholder="O que você precisa? (ex: limpeza, jardinagem...)" 
                      value={busca} 
                      onChange={(e) => setBusca(e.target.value)} 
                      className="pl-10 h-12 text-base border-gray-200 focus:border-orange-500 focus:ring-orange-500" 
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
                    />
                  </div>
                  
                  <div className="relative min-w-[200px]">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input 
                      placeholder="Sua cidade" 
                      value={cidade} 
                      onChange={(e) => setCidade(e.target.value)} 
                      className="pl-10 h-12 text-base border-gray-200 focus:border-orange-500 focus:ring-orange-500" 
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSearch} 
                    className="h-12 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
                  >
                    Buscar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recursos principais */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Profissionais verificados
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Avaliações reais
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Pagamento seguro
              </div>
            </div>

            {/* CTA secundário */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" size="lg" className="group" onClick={handleComoFunciona}>
                <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Como funciona
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <span>+1000 usuários satisfeitos</span>
              </div>
            </div>
          </div>

          {/* Visual side - Banners dos Profissionais */}
          <div className="relative">
            {/* Seção de banners com profissionais */}
            <div className="relative bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-8 rounded-2xl backdrop-blur-sm">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Nossos Profissionais
                </h3>
                <p className="text-sm text-gray-600">
                  Especialistas qualificados em diversas áreas
                </p>
              </div>
              
              <SimplifiedLocalBannerImages className="w-full" />
            </div>

            {/* Cards flutuantes menores */}
            <div className="absolute -top-4 -right-4 grid grid-cols-1 gap-3">
              {/* Card 1 - Prestador */}
              <Card className="bg-white shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300 w-48">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      JS
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs">João Silva</h4>
                      <p className="text-xs text-gray-600">Eletricista</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">4.8</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2 - Serviço */}
              <Card className="bg-white shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 w-44">
                <CardContent className="p-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white text-xs">🔧</span>
                  </div>
                  <h4 className="font-semibold text-xs mb-1">Reparos</h4>
                  <p className="text-xs text-gray-600">87 profissionais</p>
                  <Badge className="bg-green-100 text-green-700 text-xs mt-1">
                    Disponível
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
