
import React from 'react';
import { PrestadorCardImproved } from '@/components/prestadores/PrestadorCardImproved';
import { UserProfile } from '@/types';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface PrestadorGridProps {
  prestadores: UserProfile[];
  onContact: (prestador: UserProfile) => void;
  onViewProfile: (prestador: UserProfile) => void;
}

export const PrestadorGrid: React.FC<PrestadorGridProps> = ({
  prestadores,
  onContact,
  onViewProfile
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {prestadores.map(prestador => (
        <ErrorBoundary key={prestador.id}>
          <PrestadorCardImproved
            prestador={prestador}
            onContact={onContact}
            onViewProfile={onViewProfile}
          />
        </ErrorBoundary>
      ))}
    </div>
  );
};
