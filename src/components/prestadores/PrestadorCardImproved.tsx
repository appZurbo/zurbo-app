
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Phone, Eye, Heart, Crown, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';
import { FavoriteButton } from '@/components/favorites/FavoriteButton';
import { EnhancedContractButton } from '@/components/contract/EnhancedContractButton';

interface PrestadorCardImprovedProps {
  prestador: UserProfile;
  onContact: (prestador: UserProfile) => void;
  onViewProfile: (prestador: UserProfile) => void;
}

export const PrestadorCardImproved = ({ prestador, onContact, onViewProfile }: PrestadorCardImprovedProps) => {
  const [showReviews, setShowReviews] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Mock reviews data - in a real app, this would come from the database
  const mockReviews = [
    { id: 1, nota: 5, comentario: 'Excelente profissional! Muito competente.', cliente: 'Maria S.' },
    { id: 2, nota: 4, comentario: 'Bom trabalho, pontual e educado.', cliente: 'João P.' },
    { id: 3, nota: 5, comentario: 'Recomendo! Ficou perfeito.', cliente: 'Ana L.' }
  ];

  // Calculate average price from prestador_servicos
  const averagePrice = prestador.prestador_servicos?.length > 0 
    ? prestador.prestador_servicos.reduce((acc, ps) => {
        const min = ps.preco_min || 0;
        const max = ps.preco_max || 0;
        return acc + (min + max) / 2;
      }, 0) / prestador.prestador_servicos.length
    : 0;

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % mockReviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + mockReviews.length) % mockReviews.length);
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
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

        {/* Main Content View */}
        <div className={`transition-transform duration-300 ${showReviews ? '-translate-x-full' : 'translate-x-0'}`}>
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

            {/* Rating and Price */}
            <div className="flex items-center justify-between mb-3">
              {prestador.nota_media > 0 && !prestador.ocultar_nota && (
                <div className="flex items-center">
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

              {averagePrice > 0 && (
                <div className="flex items-center text-green-600 font-semibold">
                  <DollarSign className="h-4 w-4" />
                  <span>R$ {averagePrice.toFixed(0)}</span>
                </div>
              )}
            </div>

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
                  onClick={() => setShowReviews(!showReviews)}
                  className="px-3"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <EnhancedContractButton 
                prestador={prestador} 
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Reviews View */}
        <div className={`absolute inset-0 bg-white transition-transform duration-300 ${showReviews ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReviews(false)}
                className="p-1"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h4 className="font-semibold">Avaliações</h4>
              <div className="w-8" /> {/* Spacer */}
            </div>

            {/* Review Content */}
            {mockReviews.length > 0 && (
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= mockReviews[currentReviewIndex].nota
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-2 text-sm leading-relaxed">
                    "{mockReviews[currentReviewIndex].comentario}"
                  </p>
                  <p className="text-gray-500 text-xs">
                    - {mockReviews[currentReviewIndex].cliente}
                  </p>
                </div>

                {/* Navigation */}
                {mockReviews.length > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={prevReview}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-500">
                      {currentReviewIndex + 1} de {mockReviews.length}
                    </span>
                    <Button variant="ghost" size="sm" onClick={nextReview}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(prestador)}
                className="w-full"
              >
                Ver todos os comentários
              </Button>
              <EnhancedContractButton 
                prestador={prestador} 
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
