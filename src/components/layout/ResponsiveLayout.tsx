
import React, { ReactNode } from 'react';
import { ResponsiveHeader } from './ResponsiveHeader';
import { UnifiedDock } from '../mobile/UnifiedDock';
import { useMobile, useTablet } from '@/hooks/useMobile';

interface ResponsiveLayoutProps {
  children: ReactNode;
  showDock?: boolean;
  className?: string;
}

export const ResponsiveLayout = ({ 
  children, 
  showDock = true,
  className = ""
}: ResponsiveLayoutProps) => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const showBottomDock = showDock && (isMobile || isTablet);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 to-white flex flex-col">
      <ResponsiveHeader />
      
      <main 
        className={`
          flex-1 
          ${showBottomDock ? 'pb-24' : 'pb-4'} 
          ${isMobile ? 'px-4 py-4' : isTablet ? 'px-6 py-6' : 'px-8 py-8'}
          ${className}
        `}
      >
        {children}
      </main>

      {showBottomDock && <UnifiedDock />}
    </div>
  );
};
