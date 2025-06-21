
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { getPrestadores, type UserProfile } from '@/utils/database';
import { PrestadorCard } from '@/components/prestadores/PrestadorCard';
import { ModernFilters } from '@/components/filters/ModernFilters';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { ModernFooter } from '@/components/layout/ModernFooter';
import { HeroSection } from '@/components/sections/HeroSection';
import { 
  Sparkles, 
  Flower, 
  Paintbrush, 
  Zap, 
  Droplets, 
  Truck, 
  ChefHat, 
  Hammer, 
  Scissors, 
  Heart,
  ArrowRight,
  Users,
  Star,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const servicos = [
  { id: 'limpeza', nome: 'Limpeza', icone: 'Sparkles', cor: '#3B82F6' },
  { id: 'jardinagem', nome: 'Jardinagem', icone: 'Flower', cor: '#10B981' },
  { id: 'pintura', nome: 'Pintura', icone: 'Paintbrush', cor: '#8B5CF6' },
  { id: 'eletrica', nome: 'Elétrica', icone: 'Zap', cor: '#F59E0B' },
  { id: 'encanamento', nome: 'Encanamento', icone: 'Droplets', cor: '#06B6D4' },
  { id: 'mudanca', nome: 'Mudança', icone: 'Truck', cor: '#EF4444' },
  { id: 'cozinha', nome: 'Cozinha', icone: 'ChefHat', cor: '#F97316' },
  { id: 'construcao', nome: 'Construção', icone: 'Hammer', cor: '#6B7280' },
  { id: 'beleza', nome: 'Beleza', icone: 'Scissors', cor: '#EC4899' },
  { id: 'petcare', nome: 'Pet Care', icone: 'Heart', cor: '#F87171' },
];

const iconMap = {
  Sparkles, Flower, Paintbrush, Zap, Droplets, Truck, ChefHat, Hammer, Scissors, Heart
};

export default function Index() {
  const { profile, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [loadingPrestadores, setLoadingPrestadores] = useState(true);
  const [filters, setFilters] = useState({
    cidade: '',
    servico: '',
    precoMin: 0,
    precoMax: 1000,
    notaMin: 0,
    apenasПремium: false,
  });

  useEffect(() => {
    loadPrestadores();
  }, [filters]);

  const loadPrestadores = async () => {
    setLoadingPrestadores(true);
    try {
      const data = await getPrestadores({
        cidade: filters.cidade,
        servico: filters.servico,
        precoMin: filters.precoMin > 0 ? filters.precoMin : undefined,
        precoMax: filters.precoMax < 1000 ? filters.precoMax : undefined,
        notaMin: filters.notaMin > 0 ? filters.notaMin : undefined,
      });
      
      let filteredData = data;
      
      if (filters.apenasПремium) {
        filteredData = filteredData.filter(p => p.premium);
      }
      
      setPrestadores(filteredData);
    } catch (error) {
      console.error('Error loading prestadores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prestadores",
        variant: "destructive",
      });
    } finally {
      setLoadingPrestadores(false);
    }
  };

  const handleViewProfile = (prestador: UserProfile) => {
    // TODO: Implementar visualização de perfil
    console.log('View profile:', prestador);
  };

  const handleContact = (prestador: UserProfile) => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para contatar um prestador",
        variant: "destructive",
      });
      return;
    }
    // TODO: Implementar chat/contato
    console.log('Contact:', prestador);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Seção de categorias de serviços */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore nossos serviços
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Encontre profissionais qualificados para qualquer necessidade
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {servicos.map((servico) => {
              const IconComponent = iconMap[servico.icone as keyof typeof iconMap];
              return (
                <Card
                  key={servico.id}
                  className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm"
                  onClick={() => setFilters({ ...filters, servico: servico.id })}
                >
                  <CardContent className="p-4 text-center">
                    <div 
                      className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${servico.cor}20` }}
                    >
                      <IconComponent 
                        className="h-6 w-6" 
                        style={{ color: servico.cor }}
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {servico.nome}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filtros e listagem */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ModernFilters 
          filters={filters}
          onFiltersChange={setFilters}
          servicos={servicos}
        />
        
        {/* Resultados */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {loadingPrestadores ? 'Carregando...' : `${prestadores.length} prestadores encontrados`}
              </h2>
              {filters.cidade && (
                <p className="text-gray-600 mt-1">
                  em {filters.cidade}
                </p>
              )}
            </div>
            
            {prestadores.some(p => p.premium) && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                <span className="mr-1">👑</span>
                Premium disponível
              </Badge>
            )}
          </div>

          {loadingPrestadores ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : prestadores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {prestadores.map((prestador) => (
                <PrestadorCard
                  key={prestador.id}
                  prestador={prestador}
                  onViewProfile={handleViewProfile}
                  onContact={handleContact}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum prestador encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar os filtros ou buscar em outra região
              </p>
              <Button 
                variant="outline" 
                onClick={() => setFilters({
                  cidade: '',
                  servico: '',
                  precoMin: 0,
                  precoMax: 1000,
                  notaMin: 0,
                  apenasПремium: false,
                })}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Seção de estatísticas */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Prestadores cadastrados</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4.8</h3>
              <p className="text-gray-600">Avaliação média</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">Seguro e confiável</p>
            </div>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
