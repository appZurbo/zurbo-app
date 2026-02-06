
import React from 'react';
import { useLocation } from 'react-router-dom';
import { UnifiedHeader } from './UnifiedHeader';
import { UnifiedDock } from '@/components/mobile/UnifiedDock';
import { useMobile } from '@/hooks/useMobile';
import { useAuth } from '@/hooks/useAuth';
import { AdminViewToggle } from '@/components/admin/AdminViewToggle';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  showDock?: boolean;
  showHeader?: boolean;
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  children,
  showDock = true,
  showHeader = true
}) => {
  const isMobile = useMobile();
  const { profile } = useAuth();
  const location = useLocation();
  const isAdmin = profile?.tipo === 'admin';
  const isPrestadoresPage = location.pathname === '/prestadores' || location.pathname.startsWith('/prestadores');

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
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
      {showHeader && <UnifiedHeader />}

      {/* Admin View Toggle - only show for admins */}
      {isAdmin && showHeader && (
        <div className={`sticky top-16 z-40 px-4 py-2 ${isPrestadoresPage ? 'bg-[#FBF7F2]' : 'bg-[#FDFDFD]'} border-b ${isPrestadoresPage ? 'border-[#E6DDD5]/30' : 'border-gray-100'} shadow-sm relative z-30`}>
          <div className="max-w-7xl mx-auto">
            <AdminViewToggle />
          </div>
        </div>
      )}

      <main className={`bg-[#FDFDFD] ${isMobile && showDock && location.pathname !== "/" ? 'pb-24' : ''}`}>
        {children}
      </main>

      {isMobile && showDock && <UnifiedDock />}
    </div>
  );
};
