
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  adicionarFavorito, 
  removerFavorito, 
  verificarFavorito 
} from '@/utils/database/favoritos';

interface BotaoFavoritoProps {
  prestadorId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

const BotaoFavorito = ({ 
  prestadorId, 
  size = 'md',
  variant = 'ghost' 
}: BotaoFavoritoProps) => {
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      checkFavorito();
    }
  }, [prestadorId, isAuthenticated]);

  const checkFavorito = async () => {
    try {
      const favorito = await verificarFavorito(prestadorId);
      setIsFavorito(favorito);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  };

  const handleToggleFavorito = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar prestadores nos favoritos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isFavorito) {
        const sucesso = await removerFavorito(prestadorId);
        if (sucesso) {
          setIsFavorito(false);
          toast({
            title: "Removido dos favoritos",
            description: "Prestador removido dos seus favoritos",
          });
        } else {
          throw new Error('Falha ao remover dos favoritos');
        }
      } else {
        const sucesso = await adicionarFavorito(prestadorId);
        if (sucesso) {
          setIsFavorito(true);
          toast({
            title: "Adicionado aos favoritos",
            description: "Prestador salvo nos seus favoritos",
          });
        } else {
          throw new Error('Falha ao adicionar aos favoritos');
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar favoritos. Tente novamente.",
        variant: "destructive",
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
      variant={variant}
      size="icon"
      onClick={handleToggleFavorito}
      disabled={loading}
      className={`${sizeClasses[size]} ${isFavorito ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
    >
      <Heart 
        className={`${iconSizes[size]} ${isFavorito ? 'fill-current' : ''}`} 
      />
    </Button>
  );
};

export default BotaoFavorito;
