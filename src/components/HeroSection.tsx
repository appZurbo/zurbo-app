
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { EnhancedLocalBannerImages } from '@/components/banners/EnhancedLocalBannerImages';

interface BannerImage {
  name: string;
  url: string;
}

export const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscar por:', searchTerm);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="container mx-auto px-4 py-16 lg:py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Encontre o 
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  profissional ideal
                </span>
                para você
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Conectamos você aos melhores prestadores de serviços da sua região. 
                Rapidez, qualidade e confiança em um só lugar.
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Que serviço você procura? (ex: eletricista, encanador...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-gray-900 bg-white border-0 focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="h-12 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Buscar
                </Button>
              </div>
              
              <div className="flex items-center text-blue-100 text-sm">
                <MapPin className="mr-2 h-4 w-4" />
                <span>📍 Atendemos toda a região de Sinop - MT</span>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-blue-400/20">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-yellow-300">500+</div>
                <div className="text-blue-200 text-sm">Profissionais</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-yellow-300">2k+</div>
                <div className="text-blue-200 text-sm">Serviços Realizados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-yellow-300">4.9</div>
                <div className="text-blue-200 text-sm">Avaliação Média</div>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Banner Images */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl blur-2xl"></div>
            
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Nossos Serviços em Destaque
              </h3>
              
              <EnhancedLocalBannerImages 
                onImagesLoaded={setBannerImages}
                className="min-h-[300px]"
              />
              
              {bannerImages.length === 0 && (
                <div className="flex items-center justify-center min-h-[300px] text-blue-200">
                  <div className="text-center space-y-2">
                    <div className="text-6xl">🔧</div>
                    <p>Carregando serviços...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-12 fill-current text-background">
          <path d="M0,120 L0,60 Q300,0 600,60 T1200,60 L1200,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};
