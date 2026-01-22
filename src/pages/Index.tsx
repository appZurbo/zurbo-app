
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import HeroDemo from '@/components/ui/hero-demo';
import ServiceCategories from '@/components/ServiceCategories';
import { ModernFilters } from '@/components/filters/ModernFilters';
import { PrestadorCardImproved } from '@/components/prestadores/PrestadorCardImproved';
import { ContactModal } from '@/components/contact/ContactModal';
import { UserProfile } from '@/types';
import PartnersSection from '@/components/sections/PartnersSection';
import WatermarkSection from '@/components/sections/WatermarkSection';
import { ModernFooter } from '@/components/layout/ModernFooter';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useHomepage } from '@/hooks/useHomepage';
import { HomepageHeader } from '@/components/homepage/HomepageHeader';
import { PrestadorGrid } from '@/components/homepage/PrestadorGrid';
import { EmptyState } from '@/components/homepage/EmptyState';

const Index = () => {
  const [selectedPrestador, setSelectedPrestador] = useState<UserProfile | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();

  const {
    prestadores,
    loading,
    error,
    filters,
    showFavoritesOnly,
    isAuthenticated,
    handleFiltersChange,
    toggleFavoritesOnly,
    retry
  } = useHomepage();

  const handleContact = (prestador: UserProfile) => {
    setSelectedPrestador(prestador);
    setShowContactModal(true);
  };

  const handleViewProfile = (prestador: UserProfile) => {
    navigate(`/prestador/${prestador.id}`);
  };

  const handleCategorySelect = (serviceIds: string[]) => {
    console.log('📂 Services selected:', serviceIds);
    handleFiltersChange({
      ...filters,
      servicos: serviceIds
    });
  };

  return (
    <ErrorBoundary>
      <UnifiedLayout>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
          <HeroDemo />
          
          <div className="max-w-7xl mx-auto px-[30px] py-[15px]">
            {/* ServiceCategories now serves as the main interactive element replacing banners */}
            <ErrorBoundary>
              <ServiceCategories onCategorySelect={handleCategorySelect} />
            </ErrorBoundary>
            
            <div className="mt-12">
              <ErrorBoundary>
                <ModernFilters onFiltersChange={handleFiltersChange} />
              </ErrorBoundary>
            </div>

            <div className="mt-12">
              <HomepageHeader 
                isAuthenticated={isAuthenticated}
                showFavoritesOnly={showFavoritesOnly}
                onToggleFavorites={toggleFavoritesOnly}
              />

              {prestadores.length === 0 ? (
                <EmptyState 
                  loading={loading}
                  error={error}
                  showFavoritesOnly={showFavoritesOnly}
                  onRetry={retry}
                  onClearFilters={() => handleFiltersChange({
                    cidade: '',
                    servicos: [],
                    precoMin: undefined,
                    precoMax: undefined,
                    notaMin: undefined
                  })}
                  onShowAll={() => toggleFavoritesOnly()}
                />
              ) : (
                <PrestadorGrid 
                  prestadores={prestadores}
                  onContact={handleContact}
                  onViewProfile={handleViewProfile}
                />
              )}
            </div>
          </div>

          <ErrorBoundary>
            <PartnersSection />
          </ErrorBoundary>

          <ErrorBoundary>
            <WatermarkSection />
          </ErrorBoundary>

          <ErrorBoundary>
            <ModernFooter />
          </ErrorBoundary>

          {selectedPrestador && (
            <ErrorBoundary>
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
