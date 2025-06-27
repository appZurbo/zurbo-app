
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, MessageCircle, Eye, Crown, CheckCircle } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';

interface PrestadorCardImprovedProps {
  prestador: UserProfile;
  onContact: (prestador: UserProfile) => void;
  onViewProfile?: (prestador: UserProfile) => void;
}

export const PrestadorCardImproved: React.FC<PrestadorCardImprovedProps> = ({
  prestador,
  onContact,
  onViewProfile
}) => {
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(prestador);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardContent className="p-0">
        {/* Header com foto e badge premium */}
        <div className="relative p-4 pb-2">
          {prestador.premium && (
            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-orange-100">
                <AvatarImage src={prestador.foto_url} alt={prestador.nome} />
                <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                  {prestador.nome?.charAt(0)?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              {prestador.premium && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-lg">
                {prestador.nome}
              </h3>
              
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-medium text-yellow-600">
                  {prestador.nota_media?.toFixed(1) || '0.0'}
                </span>
                <span className="text-gray-500 text-sm">
                  • Avaliações
                </span>
              </div>
              
              <div className="flex items-center gap-1 mt-1 text-gray-600">
                <MapPin className="h-3 w-3" />
                <span className="text-sm truncate">
                  {prestador.endereco_cidade || 'Sinop, MT'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Descrição */}
        {prestador.bio && (
          <div className="px-4 pb-2">
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {prestador.bio}
            </p>
          </div>
        )}

        {/* Serviços */}
        {prestador.prestador_servicos && prestador.prestador_servicos.length > 0 && (
          <div className="px-4 pb-3">
            <div className="flex flex-wrap gap-1">
              {prestador.prestador_servicos.slice(0, 2).map((servico: any, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-orange-50 text-orange-700 text-xs border border-orange-200"
                >
                  {servico.servicos?.nome || 'Serviço'}
                </Badge>
              ))}
              {prestador.prestador_servicos.length > 2 && (
                <Badge variant="outline" className="text-xs border-gray-300">
                  +{prestador.prestador_servicos.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="p-4 pt-2 border-t border-gray-50">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewProfile}
              className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver Perfil
            </Button>
            <Button
              size="sm"
              onClick={() => onContact(prestador)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
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
