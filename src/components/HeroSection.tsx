
import { Search, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative orange-gradient text-white py-24 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Floating elements for visual appeal */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-slow"></div>
      <div className="absolute top-40 right-20 w-12 h-12 bg-white/20 rounded-full animate-bounce-slow" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-white/15 rounded-full animate-bounce-slow" style={{animationDelay: '2s'}}></div>
      
      <div className="relative max-w-6xl mx-auto text-center px-4">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Conecte-se com os
            <br />
            <span className="text-yellow-200">melhores profissionais</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Encontre prestadores de serviço qualificados na sua região de forma rápida e segura
          </p>
        </div>
        
        <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto mb-16">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Que serviço você precisa?"
                className="pl-12 h-14 text-gray-900 text-lg border-0 shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Sua localização"
                className="pl-12 h-14 text-gray-900 text-lg border-0 shadow-lg"
              />
            </div>
            <Button 
              size="lg"
              className="bg-white text-orange-500 hover:bg-orange-50 h-14 px-8 text-lg font-semibold shadow-lg hover-lift"
              onClick={handleSearch}
            >
              Buscar Agora
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="glass-effect rounded-2xl p-8 hover-lift">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">1K+</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Prestadores Ativos</h3>
            <p className="opacity-80">Profissionais qualificados e verificados</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-8 hover-lift" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">50+</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Tipos de Serviços</h3>
            <p className="opacity-80">Categorias diversas para todas as necessidades</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-8 hover-lift" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Avaliação 4.8</h3>
            <p className="opacity-80">Satisfação garantida pelos nossos usuários</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
