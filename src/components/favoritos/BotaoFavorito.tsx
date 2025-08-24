
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BotaoFavoritoProps {
  prestadorId: string;
  isFavorito?: boolean;
  onToggle?: () => void;
}

export const BotaoFavorito: React.FC<BotaoFavoritoProps> = ({
  prestadorId,
  isFavorito: initialFavorito = false,
  onToggle,
}) => {
  const [isFavorito, setIsFavorito] = useState(initialFavorito);

  useEffect(() => {
    setIsFavorito(initialFavorito);
  }, [initialFavorito]);

  const handleToggleFavorito = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Você precisa estar logado para favoritar.');
        return;
      }

      if (isFavorito) {
        // Remove from favorites
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('cliente_id', user.id)
          .eq('prestador_id', prestadorId);
        
        if (error) throw error;
        
        toast.success('Removido dos favoritos');
        setIsFavorito(false);
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favoritos')
          .insert({
            cliente_id: user.id,
            prestador_id: prestadorId,
          });
        
        if (error) throw error;
        
        toast.success('Adicionado aos favoritos');
        setIsFavorito(true);
      }
      
      if (onToggle) {
        onToggle();
      }
    } catch (error) {
      console.error('Erro ao gerenciar favorito:', error);
      toast.error('Erro ao gerenciar favorito');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleFavorito}
      className={`p-2 ${isFavorito ? 'text-red-500' : 'text-gray-400'}`}
    >
      <Heart
        className={`h-4 w-4 ${isFavorito ? 'fill-current' : ''}`}
      />
    </Button>
  );
};

export default BotaoFavorito;
