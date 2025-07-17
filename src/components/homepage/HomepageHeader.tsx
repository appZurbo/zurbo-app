
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface HomepageHeaderProps {
  isAuthenticated: boolean;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export const HomepageHeader: React.FC<HomepageHeaderProps> = ({
  isAuthenticated,
  showFavoritesOnly,
  onToggleFavorites
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Prestadores Disponíveis
        </h2>
        <p className="text-gray-600 mt-2">
          Encontre o profissional ideal para suas necessidades
        </p>
      </div>

      {isAuthenticated && (
        <div className="flex items-center space-x-2">
          <Switch
            id="show-favorites"
            checked={showFavoritesOnly}
            onCheckedChange={onToggleFavorites}
          />
          <Label htmlFor="show-favorites">Mostrar apenas favoritos</Label>
        </div>
      )}
    </div>
  );
};
