
import { useState, useEffect } from 'react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import HeroDemo from '@/components/ui/hero-demo';
import ServiceCategories from '@/components/ServiceCategories';
import { ModernFilters } from '@/components/filters/ModernFilters';
import { PrestadorCardImproved } from '@/components/prestadores/PrestadorCardImproved';
import { PrestadorMiniProfileModal } from '@/components/prestadores/PrestadorMiniProfileModal';
import { ContactModal } from '@/components/contact/ContactModal';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getPrestadores } from '@/utils/database/prestadores';
import { UserProfile } from '@/utils/database/types';
import { Loader2, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import PartnersSection from '@/components/sections/PartnersSection';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrestador, setSelectedPrestador] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filters, setFilters] = useState({
    cidade: '',
    servico: '',
    precoMin: undefined as number | undefined,
    precoMax: undefined as number | undefined,
    notaMin: undefined as number | undefined
  });
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadPrestadores();
  }, [filters, showFavoritesOnly]);

  const loadPrestadores = async () => {
    setLoading(true);
    try {
      const data = await getPrestadores(filters);
      
      if (showFavoritesOnly && isAuthenticated) {
        const favorites = JSON.parse(localStorage.getItem('user_favorites') || '[]');
        const filteredData = data.filter(prestador => favorites.includes(prestador.id));
        setPrestadores(filteredData);
      } else {
        setPrestadores(data);
      }
    } catch (error) {
      console.error('Error loading prestadores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prestadores.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (prestador: UserProfile) => {
    setSelectedPrestador(prestador);
    setShowContactModal(true);
  };

  const handleViewProfile = (prestador: UserProfile) => {
    setSelectedPrestador(prestador);
    setShowProfileModal(true);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleCategorySelect = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      servico: categoryId
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <UnifiedHeader />

      <HeroDemo />
      
      <div className="max-w-7xl mx-auto px-[30px] py-[15px]">
        <ServiceCategories onCategorySelect={handleCategorySelect} />
        
        <div className="mt-12">
          <ModernFilters onFiltersChange={handleFiltersChange} servicos={[]} />
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Prestadores Disponíveis
              </h2>
              <p className="text-gray-600 mt-2">
                Encontre o profissional ideal para suas necessidades
              </p>
            </div>

            {/* Show Favorites Filter */}
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-favorites"
                  checked={showFavoritesOnly}
                  onCheckedChange={setShowFavoritesOnly}
                />
                <Label htmlFor="show-favorites">Mostrar apenas favoritos</Label>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <span className="ml-2 text-gray-600">Carregando prestadores...</span>
            </div>
          ) : prestadores.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">
                  {showFavoritesOnly ? 'Nenhum favorito encontrado' : 'Nenhum prestador encontrado'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {showFavoritesOnly 
                    ? 'Você ainda não favoritou nenhum prestador.'
                    : 'Não encontramos prestadores que correspondam aos seus filtros.'
                  }
                </p>
                <Button onClick={() => {
                  if (showFavoritesOnly) {
                    setShowFavoritesOnly(false);
                  } else {
                    setFilters({
                      cidade: '',
                      servico: '',
                      precoMin: undefined,
                      precoMax: undefined,
                      notaMin: undefined
                    });
                  }
                }}>
                  {showFavoritesOnly ? 'Ver Todos Prestadores' : 'Limpar Filtros'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {prestadores.map(prestador => (
                <PrestadorCardImproved
                  key={prestador.id}
                  prestador={prestador}
                  onContact={handleContact}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <PartnersSection />

      {/* Modals */}
      {selectedPrestador && (
        <>
          <PrestadorMiniProfileModal
            prestador={selectedPrestador}
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            onContact={handleContact}
          />

          <ContactModal
            prestador={selectedPrestador}
            open={showContactModal}
            onOpenChange={setShowContactModal}
          />
        </>
      )}
    </div>
  );
};

export default Index;
