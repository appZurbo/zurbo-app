
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import HeroDemo from '@/components/ui/hero-demo';
import ProblemSection from '@/components/sections/ProblemSection';
import BenefitsGrid from '@/components/sections/BenefitsGrid';
import TrustSection from '@/components/sections/TrustSection';
import { ModernFooter } from '@/components/layout/ModernFooter';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const Index = () => {
  return (
    <ErrorBoundary>
      <UnifiedLayout>
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A1A1A] overflow-x-hidden">
          {/* Link para a fonte Plus Jakarta Sans */}
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            
            :root {
              font-family: 'Plus Jakarta Sans', sans-serif;
            }

            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              background-color: #FDFDFD;
            }
          `}</style>

          <ErrorBoundary>
            <HeroDemo />
          </ErrorBoundary>

          <ErrorBoundary>
            <ProblemSection />
          </ErrorBoundary>

          <ErrorBoundary>
            <BenefitsGrid />
          </ErrorBoundary>

          <ErrorBoundary>
            <TrustSection />
          </ErrorBoundary>

          <ErrorBoundary>
            <ModernFooter />
          </ErrorBoundary>
        </div>
      </UnifiedLayout>
    </ErrorBoundary>
  );
};

export default Index;
