
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModernFilters } from '@/components/filters/ModernFilters';
import { PrestadorCardImproved } from '@/components/prestadores/PrestadorCardImproved';
import { PremiumHighlightSection } from '@/components/prestadores/PremiumHighlightSection';
import { ServiceShortcutsSection } from '@/components/prestadores/ServiceShortcutsSection';
import { ContactModal } from '@/components/contact/ContactModal';
import { EmergencyButton } from '@/components/emergency/EmergencyButton';
import WatermarkSection from '@/components/sections/WatermarkSection';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { getPrestadores } from '@/utils/database/prestadores';
import { UserProfile } from '@/utils/database/types';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/useMobile';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_PRESTADORES } from '@/utils/mockData';
import { serviceCategories } from '@/config/serviceCategories';
import { categoryServiceNames } from '@/utils/categoryServices';

const PrestadoresPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMobile();
  const { isAuthenticated } = useAuth();

  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPrestador, setSelectedPrestador] = useState<UserProfile | null>(null);
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
    loadPrestadores(true);
  }, [filters]);

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

      // Create a timeout promise to prevent long loading times
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 1500) // 1.5s max wait for DB
      );

      // Race DB call vs timeout
      const result = await Promise.race([
        getPrestadores({
          ...filters,
          limit: ITEMS_PER_PAGE,
          page
        }),
        timeoutPromise
      ]) as any;

      const shouldUseMocks = true; // Always append/check mocks for testing phase

      if (shouldUseMocks) {
        let filteredMocks = MOCK_PRESTADORES.filter(p => {
          // City filter - more lenient for mocks
          if (filters.cidade && filters.cidade.trim()) {
            const filterCity = filters.cidade.split(',')[0].trim().toLowerCase();
            const mockCity = p.endereco_cidade ? p.endereco_cidade.toLowerCase() : '';

            // If mock has no city or filter is empty, include it
            if (!mockCity) return true; // Include mocks without city

            // Check if cities match (more lenient)
            if (!mockCity.includes(filterCity) && !filterCity.includes(mockCity.split(',')[0].trim())) {
              return false;
            }
          }

          // Service filter
          if (filters.servicos && filters.servicos.length > 0) {
            const allowedKeywords = new Set<string>();
            filters.servicos.forEach(filterS => {
              const category = serviceCategories.find(cat => cat.serviceIds?.includes(filterS));
              if (category) {
                allowedKeywords.add(category.name.toLowerCase());
                allowedKeywords.add(category.id.toLowerCase());
                const specificNames = categoryServiceNames[category.id];
                if (specificNames) {
                  specificNames.forEach(name => allowedKeywords.add(name.toLowerCase()));
                }
              } else {
                allowedKeywords.add(filterS.toLowerCase());
              }
            });
            const hasService = p.servicos_oferecidos?.some(s =>
              Array.from(allowedKeywords).some(keyword =>
                s.toLowerCase().includes(keyword) ||
                keyword.includes(s.toLowerCase())
              )
            );
            if (!hasService) return false;
          }

          // Premium filter
          if (filters.apenasPremium && !p.premium) return false;

          // Rating filter
          if (filters.notaMin && (p.nota_media || 0) < filters.notaMin) return false;

          // Price filter
          if (filters.precoMin !== undefined || filters.precoMax !== undefined) {
            const precoMin = (p as any).preco_min || (p.prestador_servicos && p.prestador_servicos.length > 0
              ? Math.min(...p.prestador_servicos.map((ps: any) => ps.preco_min || 0).filter((pr: number) => pr > 0))
              : 0);
            const precoMax = (p as any).preco_max || (p.prestador_servicos && p.prestador_servicos.length > 0
              ? Math.max(...p.prestador_servicos.map((ps: any) => ps.preco_max || 0).filter((pr: number) => pr > 0))
              : 999999);

            if (filters.precoMin !== undefined && precoMax < filters.precoMin) return false;
            if (filters.precoMax !== undefined && precoMin > filters.precoMax) return false;
          }

          return true;
        });

        const dbIds = new Set(result.prestadores.map(p => p.id));
        const nonDuplicateMocks = filteredMocks.filter(m => !dbIds.has(m.id));

        // Pagination Logic for Mocks
        // We treat the mocks as if they come AFTER the DB results
        // If we are on page 1 (reset), we show DB results + First slice of Mocks
        // If we are on page > 1, we show Next slice of Mocks

        // Mock Offset:
        // If page 1: offset 0
        // If page 2: offset = ITEMS_PER_PAGE - dbResults.length (from page 1) ... complicated.

        // SIMPLE STRATEGY:
        // Just merge them all and client-side paginate the combined list.
        // Since we can't easily re-fetch the DB part client-side without re-triggering 'getPrestadores',
        // we will assume that for this test, we just want to see "Lots of users".

        if (reset) {
          // Combine DB + Mocks
          const combined = [...result.prestadores, ...nonDuplicateMocks];

          // Initial Slice - show at least ITEMS_PER_PAGE items
          const initialSlice = combined.slice(0, ITEMS_PER_PAGE);

          console.log(`📊 Prestadores data:`, {
            dbCount: result.prestadores.length,
            mockCount: nonDuplicateMocks.length,
            combinedCount: combined.length,
            showingCount: initialSlice.length,
            firstPrestador: initialSlice[0] ? { id: initialSlice[0].id, nome: initialSlice[0].nome } : null
          });

          setPrestadores(initialSlice);
          setHasMore(combined.length > ITEMS_PER_PAGE);

          console.log(`✅ Loaded ${initialSlice.length} prestadores (${result.prestadores.length} DB + ${nonDuplicateMocks.length} Mocks, showing ${initialSlice.length})`);
        } else {
          // Load More clicked - load next page of mocks
          const dbCount = result.prestadores.length;
          const alreadyShown = prestadores.length;

          // Calculate how many mocks we've already shown
          const mocksAlreadyShown = Math.max(0, alreadyShown - dbCount);

          // Get next slice of mocks
          const mockOffset = mocksAlreadyShown;
          const mockSlice = nonDuplicateMocks.slice(mockOffset, mockOffset + ITEMS_PER_PAGE);

          // Add new DB results (if any) and new mocks
          setPrestadores(prev => {
            const newList = [...prev, ...result.prestadores, ...mockSlice];
            return newList;
          });

          setHasMore(mockOffset + ITEMS_PER_PAGE < nonDuplicateMocks.length || result.prestadores.length > 0);
        }

      } else {
        // Should not happen if shouldUseMocks = true
      }

      if (!reset) {
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      // Keep existing error handler just in case
      console.error('Error loading prestadores:', error);

      // Ensure mocks are loaded even if DB completely fails (e.g. connection error)
      if (reset) {
        console.log('⚠️ Critical DB error, falling back to pure mocks');
        let filteredMocks = MOCK_PRESTADORES.filter(p => {
          // Apply filters logic again here for redundancy
          if (filters.cidade && filters.cidade.trim()) {
            const filterCity = filters.cidade.split(',')[0].trim().toLowerCase();
            const mockCity = p.endereco_cidade ? p.endereco_cidade.toLowerCase() : '';
            if (!mockCity && filters.cidade.trim()) return false; // If filter has city but mock doesn't, exclude
            if (mockCity && !mockCity.includes(filterCity) && !filterCity.includes(mockCity.split(',')[0].trim())) {
              return false;
            }
          }
          if (filters.servicos && filters.servicos.length > 0) {
            // Simplified check for critical fallback - show all if service filter fails
            const allowedKeywords = new Set<string>();
            filters.servicos.forEach(filterS => {
              const category = serviceCategories.find(cat => cat.serviceIds?.includes(filterS));
              if (category) {
                allowedKeywords.add(category.name.toLowerCase());
                allowedKeywords.add(category.id.toLowerCase());
                const specificNames = categoryServiceNames[category.id];
                if (specificNames) {
                  specificNames.forEach(name => allowedKeywords.add(name.toLowerCase()));
                }
              } else {
                allowedKeywords.add(filterS.toLowerCase());
              }
            });
            const hasService = p.servicos_oferecidos?.some(s =>
              Array.from(allowedKeywords).some(keyword =>
                s.toLowerCase().includes(keyword) ||
                keyword.includes(s.toLowerCase())
              )
            );
            if (!hasService) return false;
          }
          if (filters.apenasPremium && !p.premium) return false;
          if (filters.notaMin && (p.nota_media || 0) < filters.notaMin) return false;
          return true;
        });
        const initialSlice = filteredMocks.slice(0, ITEMS_PER_PAGE);
        setPrestadores(initialSlice);
        setHasMore(filteredMocks.length > ITEMS_PER_PAGE);
        console.log(`✅ Loaded ${initialSlice.length} prestadores from MOCK fallback (${filteredMocks.length} total available)`);
      }
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
    console.log('🚀 Navigating to prestador profile:', prestador.id);
    navigate(`/prestador/${prestador.id}`);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleCategorySelect = (serviceIds: string[]) => {
    const currentServicos = filters.servicos;

    // Check if any of the category's services are already selected
    const hasSelectedServices = serviceIds.some(id => currentServicos.includes(id));

    let newServicos: string[];
    if (hasSelectedServices) {
      // Remove all services from this category
      newServicos = currentServicos.filter(id => !serviceIds.includes(id));
    } else {
      // Add all services from this category
      newServicos = [...currentServicos, ...serviceIds];
    }

    setFilters(prev => ({
      ...prev,
      servicos: newServicos
    }));
  };

  return (
    <UnifiedLayout>
      {/* Beige Top Section */}
      <div className="bg-[#FBF7F2] border-b border-[#E6DDD5]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className={`mb-8 ${isMobile ? '' : 'flex items-center justify-between gap-4'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                  Prestadores de <span className="text-orange-500">Serviços</span>
                </h1>
              </div>
              <p className="text-gray-500 font-medium ml-4">
                Encontre o profissional ideal para suas necessidades
              </p>
            </div>

            {/* SOS Image */}
            {!isMobile && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src="/sos button.png"
                  alt="Botão SOS"
                  className="w-40 h-40 object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => {
                    const emergencyButton = document.querySelector('[data-emergency-button]');
                    if (emergencyButton) {
                      (emergencyButton as HTMLElement).click();
                    }
                  }}
                />
                <EmergencyButton />
              </div>
            )}
          </div>

          {/* Mobile SOS Section */}
          {isMobile && (
            <div className="flex justify-end items-center gap-3 mb-6">
              <EmergencyButton />
              <img
                src="/sos button.png"
                alt="Botão SOS"
                className="w-40 h-40 object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => {
                  const emergencyButton = document.querySelector('[data-emergency-button]');
                  if (emergencyButton) {
                    (emergencyButton as HTMLElement).click();
                  }
                }}
              />
            </div>
          )}

          {/* Service Categories Section */}
          <ServiceShortcutsSection
            onCategorySelect={handleCategorySelect}
            selectedServices={filters.servicos}
          />

          {/* Filtros */}
          <div className="mb-2">
            <ModernFilters onFiltersChange={handleFiltersChange} />
          </div>
        </div>
      </div>

      {/* Main Content Area with #FDFDFD Background */}
      <div className="flex-1 bg-[#FDFDFD] pb-12 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Premium/Highlight Section */}
          <PremiumHighlightSection onContact={handleContact} onViewProfile={handleViewProfile} />

          {/* Lista Normal de Prestadores */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Todos os Prestadores ({prestadores.length})
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
                {prestadores.length > 0 && (
                  <div
                    className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}
                    style={{ minHeight: '200px' }}
                  >
                    {prestadores.map((prestador, index) => {
                      return (
                        <div key={prestador.id} style={{ minHeight: '150px' }}>
                          <PrestadorCardImproved
                            prestador={prestador}
                            onContact={handleContact}
                            onViewProfile={handleViewProfile}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
                {prestadores.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum prestador encontrado. Verifique os filtros.</p>
                  </div>
                )}

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
      </div>
      <div className="h-px bg-gray-100" /> {/* Subtle divider before footer */}

      {/* Footer */}
      <WatermarkSection />

      {/* Modals */}
      {selectedPrestador && (
        <ContactModal
          prestador={selectedPrestador}
          open={showContactModal}
          onOpenChange={setShowContactModal}
        />
      )}
    </UnifiedLayout>
  );
};

export default PrestadoresPage;
