
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ZurboDock } from '../mobile/ZurboDock';

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  const location = useLocation();
  
  // Pages where the dock should not appear
  const excludeDockPages = ['/auth'];
  const shouldShowDock = !excludeDockPages.includes(location.pathname);

  return (
    <>
      {children}
      {shouldShowDock && <ZurboDock />}
    </>
  );
};
