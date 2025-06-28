
import React, { ReactNode } from 'react';
import { ZurboDock } from '@/components/mobile/ZurboDock';
import { useMobile, useTablet } from '@/hooks/useMobile';

interface PageWithDockProps {
  children: ReactNode;
  className?: string;
}

export const PageWithDock = ({ children, className = "" }: PageWithDockProps) => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const showDock = isMobile || isTablet;

  return (
    <div className={`min-h-screen ${showDock ? 'pb-24' : ''} ${className}`}>
      {children}
      <ZurboDock />
    </div>
  );
};
