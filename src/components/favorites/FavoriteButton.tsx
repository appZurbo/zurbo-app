
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FavoriteButtonProps {
  prestadorId: string;
  isFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

export const FavoriteButton = ({ prestadorId, isFavorite: initialFavorite = false, onToggle }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();

  const handleToggleFavorite = async () => {
    if (!profile) {
      toast.error('Faça login para adicionar favoritos');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('usuario_id', profile.id)
          .eq('prestador_id', prestadorId);

        if (error) throw error;

        setIsFavorite(false);
        onToggle?.(false);
        toast.success('Removido dos favoritos!');
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favoritos')
          .insert({
            usuario_id: profile.id,
            prestador_id: prestadorId
          });

        if (error) throw error;

        setIsFavorite(true);
        onToggle?.(true);
        toast.success('Adicionado aos favoritos!');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Erro ao atualizar favoritos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
    </Button>
  );
};
