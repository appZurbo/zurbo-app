
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BotaoFavoritoProps {
  prestadorId: string;
}

export const BotaoFavorito: React.FC<BotaoFavoritoProps> = ({ prestadorId }) => {
  const { profile } = useAuth();
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [prestadorId, profile]);

  const checkFavoriteStatus = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select('id')
        .eq('cliente_id', profile.id)
        .eq('prestador_id', prestadorId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar favorito:', error);
        return;
      }

      setIsFavorito(!!data);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  };

  const toggleFavorito = async () => {
    if (!profile) {
      toast.error('Faça login para adicionar favoritos');
      return;
    }

    setLoading(true);
    try {
      if (isFavorito) {
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('cliente_id', profile.id)
          .eq('prestador_id', prestadorId);

        if (error) throw error;

        setIsFavorito(false);
        toast.success('Removido dos favoritos');
      } else {
        const { error } = await supabase
          .from('favoritos')
          .insert([{
            cliente_id: profile.id,
            prestador_id: prestadorId
          }]);

        if (error) throw error;

        setIsFavorito(true);
        toast.success('Adicionado aos favoritos');
      }
    } catch (error: any) {
      console.error('Erro ao alterar favorito:', error);
      toast.error('Erro ao alterar favorito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleFavorito}
      disabled={loading}
      className={`transition-all ${isFavorito ? 'bg-red-50 border-red-200 hover:bg-red-100' : ''}`}
    >
      <Heart className={`h-4 w-4 ${isFavorito ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
    </Button>
  );
};
