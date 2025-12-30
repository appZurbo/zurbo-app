
import React from 'react';
import { useLocation } from 'react-router-dom';
import { UnifiedHeader } from './UnifiedHeader';
import { ModernHeader } from './ModernHeader';
import { UnifiedDock } from '@/components/mobile/UnifiedDock';
import { useMobile } from '@/hooks/useMobile';
import { useAuth } from '@/hooks/useAuth';
import { AdminViewToggle } from '@/components/admin/AdminViewToggle';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  showDock?: boolean;
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  children,
  showDock = true
}) => {
  const isMobile = useMobile();
  const { profile } = useAuth();
  const location = useLocation();
  const isAdmin = profile?.tipo === 'admin';
  const isPrestadoresPage = location.pathname === '/prestadores' || location.pathname.startsWith('/prestadores');

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      {isPrestadoresPage ? <ModernHeader /> : <UnifiedHeader />}
      
      {/* Admin View Toggle - only show for admins */}
      {isAdmin && (
        <div className="sticky top-16 z-40 px-4 py-2 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto">
            <AdminViewToggle />
          </div>
        </div>
      )}
      
      <main className={`${isMobile && showDock ? 'pb-24' : ''}`}>
        {children}
      </main>
      
      {isMobile && showDock && <UnifiedDock />}
    </div>
  );
};
