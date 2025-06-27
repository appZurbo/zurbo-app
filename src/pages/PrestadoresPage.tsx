import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModernFilters } from '@/components/filters/ModernFilters';
import { PrestadorCardImproved } from '@/components/prestadores/PrestadorCardImproved';
import { PremiumHighlightSection } from '@/components/prestadores/PremiumHighlightSection';
import { PrestadorMiniProfileModal } from '@/components/prestadores/PrestadorMiniProfileModal';
import { ContactModal } from '@/components/contact/ContactModal';
import { EmergencyButton } from '@/components/emergency/EmergencyButton';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { getPrestadores } from '@/utils/database/prestadores';
import { getServicos } from '@/utils/database/servicos';
import { UserProfile } from '@/utils/database/types';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/useMobile';
import { useAuth } from '@/hooks/useAuth';

const PrestadoresPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMobile();
  const { isAuthenticated } = useAuth();
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPrestador, setSelectedPrestador] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [filters, setFilters] = useState({
    cidade: 'Sinop, Mato Grosso',
    servicos: [] as string[],
    precoMin: 0,
    precoMax: 500,
    notaMin: 0,
    apenasPremium: false
  });

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadPrestadores(true);
  }, [filters]);

  const loadInitialData = async () => {
    try {
      const servicosData = await getServicos();
      setServicos(servicosData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadPrestadores = async (reset = false) => {
    if (reset) {
      setLoading(true);
      setCurrentPage(1);
      setPrestadores([]);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const page = reset ? 1 : currentPage + 1;
      const result = await getPrestadores({
        ...filters,
        limit: ITEMS_PER_PAGE,
        page
      });

      if (reset) {
        setPrestadores(result.prestadores);
      } else {
        setPrestadores(prev => [...prev, ...result.prestadores]);
      }

      setHasMore(result.hasMore);

      if (!reset) {
        setCurrentPage(prev => prev + 1);
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
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadPrestadores(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      
      <div className={`${isMobile ? 'px-4 py-4 pb-20' : 'max-w-7xl mx-auto p-6'}`}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {!isMobile && 'Voltar'}
          </Button>
          
          <div className="flex-1">
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
              Prestadores de Serviços
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Encontre o profissional ideal para suas necessidades
            </p>
          </div>
        </div>

        {/* Emergency SOS Button */}
        {isAuthenticated && (
          <div className="mb-8">
            <EmergencyButton />
          </div>
        )}

        {/* Filtros */}
        <div className="mb-8">
          <ModernFilters onFiltersChange={handleFiltersChange} servicos={servicos} />
        </div>

        {/* Premium/Highlight Section */}
        <PremiumHighlightSection
          onContact={handleContact}
          onViewProfile={handleViewProfile}
        />

        {/* Lista Normal de Prestadores */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Todos os Prestadores
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <span className="ml-2 text-gray-600">Carregando prestadores...</span>
            </div>
          ) : prestadores.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Nenhum prestador encontrado</h3>
                <p className="text-gray-600 mb-4">
                  Não encontramos prestadores que correspondam aos seus filtros.
                </p>
                <Button onClick={() => setFilters({
                  cidade: 'Sinop, Mato Grosso',
                  servicos: [],
                  precoMin: 0,
                  precoMax: 500,
                  notaMin: 0,
                  apenasPremium: false
                })}>
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {prestadores.map(prestador => (
                  <PrestadorCardImproved
                    key={prestador.id}
                    prestador={prestador}
                    onContact={handleContact}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {(hasMore || loadingMore) && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    variant="outline"
                    size="lg"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      'Carregar mais prestadores'
                    )}
                  </Button>
                </div>
              )}

              {/* End of results message */}
              {!hasMore && !loadingMore && prestadores.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Não há mais prestadores disponíveis para os filtros selecionados.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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

export default PrestadoresPage;
