
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
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
import { Loader2, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import PartnersSection from '@/components/sections/PartnersSection';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const Index = () => {
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const navigate = useNavigate();

  useEffect(() => {
    loadPrestadores();
  }, [filters, showFavoritesOnly]);

  const loadPrestadores = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Loading prestadores with filters:', filters);
      const result = await getPrestadores(filters);
      
      // Validate and filter data
      const validPrestadores = result.prestadores.filter(p => {
        if (!p || !p.id || !p.nome) {
          console.warn('Invalid prestador data:', p);
          return false;
        }
        return true;
      });
      
      console.log(`✅ Loaded ${validPrestadores.length} valid prestadores`);
      
      if (showFavoritesOnly && isAuthenticated) {
        const favorites = JSON.parse(localStorage.getItem('user_favorites') || '[]');
        const filteredData = validPrestadores.filter(prestador => favorites.includes(prestador.id));
        setPrestadores(filteredData);
      } else {
        setPrestadores(validPrestadores);
      }
    } catch (error) {
      console.error('❌ Error loading prestadores:', error);
      setError('Não foi possível carregar os prestadores');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prestadores. Tente novamente.",
        variant: "destructive"
      });
      setPrestadores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (prestador: UserProfile) => {
    if (!prestador || !prestador.id) {
      console.error('Invalid prestador data for contact:', prestador);
      toast({
        title: "Erro",
        description: "Dados do prestador inválidos.",
        variant: "destructive"
      });
      return;
    }
    console.log('📞 Contacting prestador:', prestador.nome);
    setSelectedPrestador(prestador);
    setShowContactModal(true);
  };

  const handleViewProfile = (prestador: UserProfile) => {
    if (!prestador || !prestador.id) {
      console.error('Invalid prestador data for profile:', prestador);
      toast({
        title: "Erro",
        description: "Dados do prestador inválidos.",
        variant: "destructive"
      });
      return;
    }
    console.log('👤 Viewing profile:', prestador.nome);
    setSelectedPrestador(prestador);
    setShowProfileModal(true);
  };

  const handleFiltersChange = (newFilters: any) => {
    console.log('🔄 Filters changed:', newFilters);
    setFilters(newFilters);
  };

  const handleCategorySelect = (categoryId: string) => {
    console.log('📂 Category selected:', categoryId);
    navigate(`/prestadores?servico=${categoryId}`);
  };

  const handleRetry = () => {
    loadPrestadores();
  };

  return (
    <ErrorBoundary>
      <UnifiedLayout>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
          <HeroDemo />
          
          <div className="max-w-7xl mx-auto px-[30px] py-[15px]">
            <ErrorBoundary>
              <ServiceCategories onCategorySelect={handleCategorySelect} />
            </ErrorBoundary>
            
            <div className="mt-12">
              <ErrorBoundary>
                <ModernFilters onFiltersChange={handleFiltersChange} servicos={[]} />
              </ErrorBoundary>
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
              ) : error ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                    <h3 className="text-xl font-semibold mb-2 text-red-600">Erro ao Carregar</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={handleRetry} variant="outline">
                      Tentar Novamente
                    </Button>
                  </CardContent>
                </Card>
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
                    <div className="space-y-2">
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
                      {!showFavoritesOnly && (
                        <p className="text-sm text-gray-500 mt-2">
                          💡 Dica: Vá para <strong>/admin/relatorios</strong> e clique em "Criar Sistema Completo" para adicionar dados de teste
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {prestadores.map(prestador => (
                    <ErrorBoundary key={prestador.id}>
                      <PrestadorCardImproved
                        prestador={prestador}
                        onContact={handleContact}
                        onViewProfile={handleViewProfile}
                      />
                    </ErrorBoundary>
                  ))}
                </div>
              )}
            </div>
          </div>

          <ErrorBoundary>
            <PartnersSection />
          </ErrorBoundary>

          {selectedPrestador && (
            <ErrorBoundary>
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
            </ErrorBoundary>
          )}
        </div>
      </UnifiedLayout>
    </ErrorBoundary>
  );
};

export default Index;
