import React from 'react';
import { MessageCircle, Heart, Star, MapPin, Crown, Tag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/utils/database/types';

interface PrestadorCardImprovedProps {
  prestador: UserProfile;
  onContact: (prestador: UserProfile) => void;
  onViewProfile: (prestador: UserProfile) => void;
}

export const PrestadorCardImproved = ({
  prestador,
  onContact,
  onViewProfile
}: PrestadorCardImprovedProps) => {
  // Debug log
  if (!prestador || !prestador.id) {
    console.error('❌ PrestadorCardImproved: Invalid prestador data', prestador);
    return null;
  }

  const isPremium = prestador.premium || false;
  const rating = prestador.nota_media || 0;
  const isOnline = prestador.em_servico ?? true;

  // Get first service name
  const firstService = prestador.servicos_oferecidos?.[0] || prestador.tipo || 'Prestador de Serviços';

  // Calculate distance (mock for now)
  const distance = '2.5 km';

  // Get price range from prestador_servicos or direct properties
  let precoMin = prestador.preco_min;
  let precoMax = prestador.preco_max;

  // Extract prices from prestador_servicos (for mock data structure)
  if (!precoMin && prestador.prestador_servicos && prestador.prestador_servicos.length > 0) {
    const servicos = prestador.prestador_servicos;
    const allMins = servicos
      .map((ps: any) => ps.preco_min)
      .filter((p: number) => p != null && p > 0);
    const allMaxs = servicos
      .map((ps: any) => ps.preco_max)
      .filter((p: number) => p != null && p > 0);

    if (allMins.length > 0) {
      precoMin = Math.min(...allMins);
    }
    if (allMaxs.length > 0) {
      precoMax = Math.max(...allMaxs);
    }
  }

  const priceRange = precoMin && precoMax
    ? `R$ ${precoMin} - ${precoMax}`
    : precoMin
      ? `R$ ${precoMin}/h`
      : 'Consulte';

  const handleCardClick = () => {
    console.log('🖱️ Card clicked:', prestador.id, prestador.nome);
    onViewProfile(prestador);
  };

  return (
    <div
      className="p-4 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#E6DDD5]/40 flex gap-4 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden group"
      onClick={handleCardClick}
      style={{
        minWidth: '100%',
        display: 'flex',
        visibility: 'visible',
        opacity: 1
      }}
    >
      {/* Refined Inner Border effect for top depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
      {/* Avatar with Rating Badge */}
      <div className="relative flex-shrink-0">
        <img
          src={prestador.foto_url || `https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=${encodeURIComponent(prestador.nome || 'User')}`}
          alt={`Foto de ${prestador.nome}`}
          className="h-20 w-20 rounded-xl object-cover"
        />
        {rating > 0 && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-sm border border-[#E6DDD5] flex items-center gap-1 min-w-max">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-[#3D342B]">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#3D342B] truncate">{prestador.nome}</h3>
            <p className="text-xs text-[#8C7E72] truncate">{firstService}</p>
          </div>
          <button
            className="text-[#8C7E72] hover:text-red-500 transition-colors flex-shrink-0 ml-2"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implementar favoritar
            }}
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* Info Badges */}
        <div className="flex items-center gap-3 mt-3 mb-3 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-[#8C7E72] bg-[#FEE8D6]/30 px-2 py-1 rounded-md">
            <MapPin className="h-3 w-3" />
            <span>{distance}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#8C7E72] bg-[#FEE8D6]/30 px-2 py-1 rounded-md">
            <Tag className="h-3 w-3 text-[#E05815]" />
            <span className="font-medium text-[#3D342B]">{priceRange}</span>
          </div>
        </div>

        {/* Premium Badge */}
        {isPremium && (
          <div className="mt-2">
            <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs border-0">
              <Crown className="h-2 w-2 mr-1" />
              Premium
            </Badge>
          </div>
        )}
      </div>
    </div >
  );
};