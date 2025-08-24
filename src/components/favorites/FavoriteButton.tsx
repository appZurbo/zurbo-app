import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  prestadorId: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  prestadorId, 
  size = 'md' 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { profile, isAuthenticated } = useAuth();

  useEffect(() => {
    // Simular verificação se é favorito
    const favorites = JSON.parse(localStorage.getItem('user_favorites') || '[]');
    setIsFavorite(favorites.includes(prestadorId));
  }, [prestadorId]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para favoritar prestadores.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const favorites = JSON.parse(localStorage.getItem('user_favorites') || '[]');
      
      if (isFavorite) {
        const newFavorites = favorites.filter((id: string) => id !== prestadorId);
        localStorage.setItem('user_favorites', JSON.stringify(newFavorites));
        setIsFavorite(false);
        toast({
          title: "Removido dos favoritos",
          description: "Prestador removido da sua lista de favoritos."
        });
      } else {
        const newFavorites = [...favorites, prestadorId];
        localStorage.setItem('user_favorites', JSON.stringify(newFavorites));
        setIsFavorite(true);
        toast({
          title: "Adicionado aos favoritos",
          description: "Prestador adicionado à sua lista de favoritos."
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`${sizeClasses[size]} ${isFavorite ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
      onClick={toggleFavorite}
      disabled={loading}
    >
      <Heart 
        className={`${iconSizes[size]} ${isFavorite ? 'fill-current' : ''}`} 
      />
    </Button>
  );
};
