
import React, { ReactNode } from 'react';
import { UnifiedHeader } from './UnifiedHeader';
import { UnifiedDock } from '../mobile/UnifiedDock';
import { useMobile, useTablet } from '@/hooks/useMobile';

interface UnifiedLayoutProps {
  children: ReactNode;
  showDock?: boolean;
  className?: string;
}

export const UnifiedLayout = ({ 
  children, 
  showDock = true,
  className = ""
}: UnifiedLayoutProps) => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const showBottomDock = showDock && (isMobile || isTablet);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 to-white flex flex-col">
      <UnifiedHeader />
      
      <main 
        className={`
          flex-1 
          ${showBottomDock ? 'pb-24' : 'pb-4'} 
          ${className}
        `}
      >
        {children}
      </main>

      {showBottomDock && <UnifiedDock />}
    </div>
  );
};
