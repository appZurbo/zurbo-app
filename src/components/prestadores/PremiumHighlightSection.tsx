
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PrestadorCardImproved } from './PrestadorCardImproved';
import { Crown, Star, Loader2 } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';
import { getPrestadoresPremiumDestaque } from '@/utils/database/prestadores';

interface PremiumHighlightSectionProps {
  onContact: (prestador: UserProfile) => void;
  onViewProfile: (prestador: UserProfile) => void;
}

export const PremiumHighlightSection: React.FC<PremiumHighlightSectionProps> = ({
  onContact,
  onViewProfile
}) => {
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPremiumHighlight();
  }, []);

  const loadPremiumHighlight = async () => {
    try {
      const data = await getPrestadoresPremiumDestaque();
      setPrestadores(data);
    } catch (error) {
      console.error('Error loading premium/highlight prestadores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-600">Carregando destaques...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (prestadores.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-orange-200 bg-gradient-to-r from-orange-400 to-orange-600 text-white overflow-hidden">
      <CardHeader className="bg-white/10 backdrop-blur-sm">
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="flex items-center gap-1">
            <Crown className="h-5 w-5 text-yellow-300" />
            <Star className="h-5 w-5 text-yellow-300" />
          </div>
          Prestadores Premium e em Destaque
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {prestadores.map((prestador) => (
              <CarouselItem key={prestador.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-1">
                  <PrestadorCardImproved
                    prestador={prestador}
                    onContact={onContact}
                    onViewProfile={onViewProfile}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-white/90 hover:bg-white text-orange-600 border-orange-200" />
          <CarouselNext className="hidden md:flex -right-4 bg-white/90 hover:bg-white text-orange-600 border-orange-200" />
        </Carousel>
      </CardContent>
    </Card>
  );
};
