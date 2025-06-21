
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Star, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { ZurboCharacter } from '../hero/ZurboCharacter';
import { useNavigate } from 'react-router-dom';

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
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleComoFunciona = () => {
    const comoFuncionaSection = document.getElementById('como-funciona');
    if (comoFuncionaSection) {
      comoFuncionaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 lg:py-24 overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Personagem 3D */}
      <ZurboCharacter />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo principal */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 mb-4">
                ✨ Conectando talentos em toda cidade
              </Badge>
              
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
              <Button 
                variant="outline" 
                size="lg" 
                className="group"
                onClick={handleComoFunciona}
              >
                <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Como funciona
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <span>+1000 usuários satisfeitos</span>
              </div>
            </div>
          </div>

          {/* Visual side - Cards flutuantes */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 - Prestador */}
              <Card className="bg-white shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      AM
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Ana Maria</h4>
                      <p className="text-xs text-gray-600">Limpeza</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">5.0</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2 - Serviço */}
              <Card className="bg-white shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300 mt-8">
                <CardContent className="p-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-white text-sm">🌱</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Jardinagem</h4>
                  <p className="text-xs text-gray-600">124 profissionais</p>
                  <Badge className="bg-green-100 text-green-700 text-xs mt-2">
                    Disponível
                  </Badge>
                </CardContent>
              </Card>

              {/* Card 3 - Premium */}
              <Card className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300 col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">👑</span>
                    <h4 className="font-bold text-sm">Premium</h4>
                  </div>
                  <p className="text-xs opacity-90">
                    Destaque seu perfil e receba mais clientes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
