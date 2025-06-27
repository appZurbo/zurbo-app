import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Phone, Eye, Heart, Crown } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';
import { FavoriteButton } from '@/components/favorites/FavoriteButton';
import { EnhancedContractButton } from '@/components/contract/EnhancedContractButton';

interface PrestadorCardImprovedProps {
  prestador: UserProfile;
  onContact: (prestador: UserProfile) => void;
  onViewProfile: (prestador: UserProfile) => void;
}

export const PrestadorCardImproved = ({ prestador, onContact, onViewProfile }: PrestadorCardImprovedProps) => {
  

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-0">
        {/* Premium Badge */}
        {prestador.premium && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}

        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton prestadorId={prestador.id} />
        </div>

        {/* Profile Image */}
        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
          {prestador.foto_url ? (
            <img
              src={prestador.foto_url}
              alt={prestador.nome}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-orange-500 text-white">
                  {prestador.nome.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                {prestador.nome}
              </h3>
              
              {prestador.endereco_cidade && (
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{prestador.endereco_cidade}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          {prestador.nota_media > 0 && !prestador.ocultar_nota && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.floor(prestador.nota_media)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({prestador.nota_media.toFixed(1)})
              </span>
            </div>
          )}

          {/* Services */}
          {prestador.servicos_oferecidos && prestador.servicos_oferecidos.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {prestador.servicos_oferecidos.slice(0, 2).map((servico, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {servico}
                  </Badge>
                ))}
                {prestador.servicos_oferecidos.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{prestador.servicos_oferecidos.length - 2} mais
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Bio */}
          {prestador.bio && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {prestador.bio}
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(prestador)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Perfil
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onContact(prestador)}
                className="flex-1"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contato
              </Button>
            </div>
            
            <EnhancedContractButton 
              prestador={prestador} 
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
