
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  MessageCircle, 
  Phone, 
  Crown,
  Shield,
  Verified,
  Heart,
  Eye
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChatModal from './ChatModal';
import { BotaoFavorito } from './favoritos/BotaoFavorito';

interface PrestadorCardProps {
  prestador: {
    id: string;
    nome: string;
    foto_url?: string;
    nota_media: number;
    endereco_cidade?: string;
    endereco_bairro?: string;
    premium?: boolean;
    tipo?: string;
    descricao_servico?: string;
    telefone?: string;
    em_servico?: boolean;
  };
  compact?: boolean;
  showDistance?: boolean;
  distance?: number;
}

const PrestadorCard = ({ 
  prestador, 
  compact = false, 
  showDistance = false, 
  distance 
}: PrestadorCardProps) => {
  const [showChat, setShowChat] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleContactClick = () => {
    setShowChat(true);
  };

  const isPremium = prestador.premium || false;
  const isVerified = prestador.tipo === 'prestador' && isPremium;
  const isOnline = prestador.em_servico ?? true;

  return (
    <>
      <Card 
        className={`overflow-hidden transition-all duration-300 hover:shadow-xl group ${
          isPremium 
            ? 'border-2 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50' 
            : 'border border-gray-200 hover:border-orange-300 hover:shadow-lg'
        }`}
        style={isPremium ? {
          boxShadow: '0 0 20px rgba(251, 191, 36, 0.2)',
          border: '2px solid #f59e0b'
        } : {}}
      >
        <CardContent className={`${compact ? 'p-4' : 'p-6'}`}>
          <div className="flex items-start gap-4">
            {/* Avatar with Premium Border */}
            <div className="relative flex-shrink-0">
              <div className={`${isPremium ? 'p-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full' : ''}`}>
                <Avatar className={`${compact ? 'h-12 w-12' : 'h-16 w-16'} ${isPremium ? 'border-2 border-white' : ''}`}>
                  <AvatarImage src={prestador.foto_url} alt={prestador.nome} />
                  <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                    {prestador.nome.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Online Status */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Header with Name and Badges */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold text-gray-900 truncate ${compact ? 'text-base' : 'text-lg'}`}>
                      {prestador.nome}
                    </h3>
                    
                    {isVerified && (
                      <div className="flex items-center gap-1">
                        <Verified className="h-4 w-4 text-blue-500" />
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          PRO
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm">
                        {prestador.nota_media.toFixed(1)}
                      </span>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      isOnline 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>

                  {/* Location */}
                  {(prestador.endereco_cidade || prestador.endereco_bairro) && (
                    <div className="flex items-center gap-1 text-gray-600 mb-2">
                      <MapPin className="h-3 w-3" />
                      <span className="text-sm truncate">
                        {prestador.endereco_bairro && `${prestador.endereco_bairro}, `}
                        {prestador.endereco_cidade}
                      </span>
                      {showDistance && distance && (
                        <span className="text-xs text-gray-500 ml-1">
                          • {distance.toFixed(1)}km
                        </span>
                      )}
                    </div>
                  )}

                  {/* Service Description */}
                  {!compact && prestador.descricao_servico && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {prestador.descricao_servico}
                    </p>
                  )}
                </div>

                {/* Favorite Button */}
                <BotaoFavorito 
                  prestadorId={prestador.id}
                  className="ml-2"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleContactClick}
                  size="sm"
                  className={`flex-1 ${
                    isPremium 
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Conversar
                </Button>
                
                {prestador.telefone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${prestador.telefone}`, '_blank')}
                    className="border-gray-300 hover:border-orange-500 hover:text-orange-600"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Premium Benefits */}
              {isPremium && !compact && (
                <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 text-xs text-yellow-800">
                    <Shield className="h-3 w-3" />
                    <span>Prestador PRO Verificado</span>
                    <Eye className="h-3 w-3 ml-auto" />
                    <span>Prioridade</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ChatModal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        prestador={prestador}
      />
    </>
  );
};

export default PrestadorCard;
