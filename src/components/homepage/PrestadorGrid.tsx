
import React from 'react';
import { PrestadorCardImproved } from '@/components/prestadores/PrestadorCardImproved';
import { UserProfile } from '@/types';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PrestadorGridProps {
  prestadores: UserProfile[];
  onContact: (prestador: UserProfile) => void;
  onViewProfile: (prestador: UserProfile) => void;
}

export const PrestadorGrid: React.FC<PrestadorGridProps> = ({
  prestadores,
  onContact,
  onViewProfile
}) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {prestadores.map(prestador => (
          <CarouselItem key={prestador.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="h-full p-1">
              <ErrorBoundary key={prestador.id}>
                <PrestadorCardImproved
                  prestador={prestador}
                  onContact={onContact}
                  onViewProfile={onViewProfile}
                />
              </ErrorBoundary>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-12" />
      <CarouselNext className="-right-12" />
    </Carousel>
  );
};
