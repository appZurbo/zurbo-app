
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
        <div className="font-sans text-[#1A1A1A] overflow-x-hidden">


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
