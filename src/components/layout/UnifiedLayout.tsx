
import React from 'react';
import { UnifiedHeader } from './UnifiedHeader';
import { ModernFooter } from './ModernFooter';
import { MobileDock } from '../mobile/MobileDock';
import { useMobile } from '@/hooks/useMobile';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  showMobileDock?: boolean;
}

export const UnifiedLayout = ({ children, showMobileDock = true }: UnifiedLayoutProps) => {
  const isMobile = useMobile();

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UnifiedHeader />
        
        <main className="flex-1">
          {children}
        </main>
        
        <ModernFooter />
        
        {isMobile && showMobileDock && <MobileDock />}
      </div>
    </ErrorBoundary>
  );
};
