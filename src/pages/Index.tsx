import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import HeroDemo from '@/components/ui/hero-demo';
import ServiceCategories from '@/components/ServiceCategories';
import { ModernFilters } from '@/components/filters/ModernFilters';
import { PrestadorCardImproved } from '@/components/prestadores/PrestadorCardImproved';
import { PrestadorMiniProfileModal } from '@/components/prestadores/PrestadorMiniProfileModal';
import { ContactModal } from '@/components/contact/ContactModal';
import { UserProfile } from '@/types';
import PartnersSection from '@/components/sections/PartnersSection';
import WatermarkSection from '@/components/sections/WatermarkSection';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useHomepage } from '@/hooks/useHomepage';
import { HomepageHeader } from '@/components/homepage/HomepageHeader';
import { PrestadorGrid } from '@/components/homepage/PrestadorGrid';
import { EmptyState } from '@/components/homepage/EmptyState';

const Index = () => {
  console.log("🔍 Index component started");
  const [selectedPrestador, setSelectedPrestador] = useState<UserProfile | null>(null);
  console.log("🔍 useState 1 completed");
  const [showProfileModal, setShowProfileModal] = useState(false);
  console.log("🔍 useState 2 completed");
  const [showContactModal, setShowContactModal] = useState(false);
  console.log("🔍 useState 3 completed");
  const navigate = useNavigate();
  console.log("🔍 useNavigate completed, calling useHomepage...");

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
    setSelectedPrestador(prestador);
    setShowProfileModal(true);
  };

  const handleCategorySelect = (serviceIds: string[]) => {
    console.log('📂 Services selected:', serviceIds);
    handleFiltersChange({
      ...filters,
      servico: serviceIds[0] // Use first selected service
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
                    servico: '',
                    priceRange: undefined,
                    rating: undefined
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
