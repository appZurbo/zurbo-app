import React from 'react';
import { UnifiedHeader } from './UnifiedHeader';
import { UnifiedDock } from './UnifiedDock';
import { useMobile } from '@/hooks/useMobile';

export interface UnifiedLayoutProps {
  children: React.ReactNode;
  showMobileDock?: boolean;
  showHeader?: boolean;
}

import { AdminViewToggle } from '@/components/admin/AdminViewToggle';
import { useAuthSimulation } from '@/hooks/useAuthSimulation';

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ 
  children, 
  showMobileDock = true,
  showHeader = true 
}) => {
  const auth = useAuthSimulation();
  const isMobile = useMobile();

  const handleSimulationChange = (isSimulating: boolean, simulatedRole?: 'cliente' | 'prestador') => {
    if (isSimulating && simulatedRole) {
      auth.enableSimulation(simulatedRole);
    } else {
      auth.disableSimulation();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin Toggle - Apenas para admins */}
      {auth.isAdmin && showHeader && (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <AdminViewToggle onSimulationChange={handleSimulationChange} />
        </div>
      )}

      {/* Header Principal */}
      {showHeader && <UnifiedHeader />}
      
      {/* Main Content */}
      <main className={`${isMobile && showMobileDock ? 'pb-20' : ''}`}>
        {children}
      </main>
      
      {/* Mobile Dock */}
      {showMobileDock && isMobile && <UnifiedDock />}
    </div>
  );
};
