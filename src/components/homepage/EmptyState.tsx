
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  loading: boolean;
  error: string | null;
  showFavoritesOnly: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
  onShowAll: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  loading,
  error,
  showFavoritesOnly,
  onRetry,
  onClearFilters,
  onShowAll
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-600">Carregando prestadores...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h3 className="text-xl font-semibold mb-2 text-red-600">Erro ao Carregar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={onRetry} variant="outline">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">
          {showFavoritesOnly ? 'Nenhum favorito encontrado' : 'Nenhum prestador encontrado'}
        </h3>
        <p className="text-gray-600 mb-4">
          {showFavoritesOnly 
            ? 'Você ainda não favoritou nenhum prestador.'
            : 'Não encontramos prestadores que correspondam aos seus filtros.'
          }
        </p>
        <div className="space-y-2">
          <Button onClick={showFavoritesOnly ? onShowAll : onClearFilters}>
            {showFavoritesOnly ? 'Ver Todos Prestadores' : 'Limpar Filtros'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
