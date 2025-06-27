
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import { FavoriteButton } from '@/components/favorites/FavoriteButton';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  User, 
  Crown,
  Clock,
  CheckCircle 
} from 'lucide-react';
import { UserProfile } from '@/utils/database/types';

interface PrestadorCardImprovedProps {
  prestador: UserProfile;
  onContact: (prestador: UserProfile) => void;
  onViewProfile: (prestador: UserProfile) => void;
}

export const PrestadorCardImproved: React.FC<PrestadorCardImprovedProps> = ({
  prestador,
  onContact,
  onViewProfile
}) => {
  if (!prestador || !prestador.id) {
    return null;
  }

  const handleContact = () => {
    onContact(prestador);
  };

  const handleViewProfile = () => {
    onViewProfile(prestador);
  };

  const getInitials = (nome: string) => {
    if (!nome) return 'UN';
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLocation = () => {
    const parts = [];
    if (prestador.endereco_bairro) parts.push(prestador.endereco_bairro);
    if (prestador.endereco_cidade) parts.push(prestador.endereco_cidade);
    return parts.join(', ') || 'Localização não informada';
  };

  const getBio = () => {
    if (prestador.bio && prestador.bio.trim()) {
      return prestador.bio.length > 100 
        ? `${prestador.bio.substring(0, 100)}...` 
        : prestador.bio;
    }
    if (prestador.descricao_servico && prestador.descricao_servico.trim()) {
      return prestador.descricao_servico.length > 100
        ? `${prestador.descricao_servico.substring(0, 100)}...`
        : prestador.descricao_servico;
    }
    return 'Profissional disponível para atendimento';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white relative overflow-hidden">
      {prestador.premium && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-orange-400 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
          <Crown className="w-3 h-3 inline mr-1" />
          Premium
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-orange-200">
              <AvatarImage 
                src={prestador.foto_url || undefined} 
                alt={prestador.nome || 'Prestador'} 
              />
              <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                {getInitials(prestador.nome || 'Usuario')}
              </AvatarFallback>
            </Avatar>
            {prestador.em_servico && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 truncate">
                {prestador.nome || 'Nome não informado'}
              </h3>
              <FavoriteButton prestadorId={prestador.id} />
            </div>

            <div className="flex items-center gap-1 mt-1">
              <StarRating 
                rating={Number(prestador.nota_media) || 0} 
                size="sm" 
                readonly 
              />
              <span className="text-sm text-gray-600 ml-1">
                ({Number(prestador.nota_media).toFixed(1) || '0.0'})
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{formatLocation()}</span>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            {getBio()}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {prestador.em_servico ? (
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Disponível
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
                <Clock className="w-3 h-3 mr-1" />
                Ocupado
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleContact}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contatar
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
            onClick={handleViewProfile}
          >
            <User className="w-4 h-4 mr-2" />
            Perfil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
