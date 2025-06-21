
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Crown, MapPin, MessageCircle, Eye } from 'lucide-react';
import { UserProfile } from '@/utils/database';

interface PrestadorCardProps {
  prestador: UserProfile & {
    prestador_servicos?: Array<{
      servico_id: string;
      preco_min?: number;
      preco_max?: number;
      servicos: {
        nome: string;
        icone: string;
        cor: string;
      };
    }>;
    avaliacoes?: Array<{
      nota: number;
      comentario?: string;
      criado_em: string;
      avaliador: {
        nome: string;
        foto_url?: string;
      };
    }>;
  };
  onViewProfile: (prestador: UserProfile) => void;
  onContact: (prestador: UserProfile) => void;
}

export const PrestadorCard = ({ prestador, onViewProfile, onContact }: PrestadorCardProps) => {
  const [imageError, setImageError] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getPrecoRange = () => {
    if (!prestador.prestador_servicos?.length) return null;
    
    const precos = prestador.prestador_servicos
      .filter(s => s.preco_min || s.preco_max)
      .map(s => ({ min: s.preco_min || 0, max: s.preco_max || 0 }));
    
    if (precos.length === 0) return null;
    
    const minPreco = Math.min(...precos.map(p => p.min).filter(p => p > 0));
    const maxPreco = Math.max(...precos.map(p => p.max));
    
    if (minPreco === maxPreco) {
      return `R$ ${minPreco}`;
    }
    
    return `R$ ${minPreco} - R$ ${maxPreco}`;
  };

  const totalAvaliacoes = prestador.avaliacoes?.length || 0;

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-0 shadow-md">
      <CardContent className="p-0">
        {/* Header com foto e badge premium */}
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
            {prestador.foto_url && !imageError ? (
              <img
                src={prestador.foto_url}
                alt={prestador.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-2xl font-bold bg-orange-500 text-white">
                    {prestador.nome.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          
          {prestador.premium && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          
          {!prestador.ocultar_nota && prestador.nota_media > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-800">
                {prestador.nota_media.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Conteúdo do card */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
              {prestador.nome}
            </h3>
            
            {prestador.endereco_cidade && (
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                {prestador.endereco_cidade}
              </div>
            )}
          </div>

          {/* Serviços */}
          {prestador.prestador_servicos && prestador.prestador_servicos.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {prestador.prestador_servicos.slice(0, 3).map((servico, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-orange-50 text-orange-700 hover:bg-orange-100"
                >
                  {servico.servicos.nome}
                </Badge>
              ))}
              {prestador.prestador_servicos.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                  +{prestador.prestador_servicos.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Avaliações */}
          {!prestador.ocultar_nota && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {renderStars(prestador.nota_media)}
                <span className="text-sm text-gray-600 ml-1">
                  ({totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
                </span>
              </div>
              
              {getPrecoRange() && (
                <div className="text-sm font-semibold text-gray-900">
                  {getPrecoRange()}
                </div>
              )}
            </div>
          )}

          {/* Bio resumida */}
          {prestador.bio && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {prestador.bio}
            </p>
          )}

          {/* Botões de ação */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-gray-50"
              onClick={() => onViewProfile(prestador)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver perfil
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={() => onContact(prestador)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Contatar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
