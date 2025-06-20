
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  return (
    <div className="relative gradient-bg text-white py-20">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          Encontre o prestador ideal
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Conectamos você aos melhores profissionais da sua região
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Que serviço você precisa?"
              className="pl-10 h-12 text-gray-900"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSearch((e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Sua localização"
              className="pl-10 h-12 text-gray-900"
            />
          </div>
          <Button 
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 h-12 px-8"
            onClick={() => onSearch('')}
          >
            Buscar
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-3xl font-bold">1000+</div>
            <div className="text-lg opacity-90">Prestadores ativos</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-3xl font-bold">50+</div>
            <div className="text-lg opacity-90">Tipos de serviços</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-lg opacity-90">Suporte disponível</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
