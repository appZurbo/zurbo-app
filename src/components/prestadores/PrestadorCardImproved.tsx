import React from 'react';
import { MessageCircle, Phone, Star, MapPin, Crown, Shield } from 'lucide-react';
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
  const isPremium = prestador.premium || false;
  const rating = prestador.nota_media || 0;
  const isOnline = prestador.em_servico ?? true;

  return (
    <div className="card-prestador-moderno">
      {/* Header Section with Photo and Name */}
      <div className="header">
        <img 
          src={prestador.foto_url || 'https://placehold.co/128x128/E2E8F0/4A5568?text=Foto'} 
          alt={`Foto de ${prestador.nome}`} 
          className="avatar"
        />
        <div className="info">
          <h3>{prestador.nome}</h3>
          <p>{prestador.tipo || 'Prestador de Serviços'}</p>
          
          {/* Rating and Status */}
          {rating > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-gray-700">
                  {rating.toFixed(1)}
                </span>
              </div>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs border-0">
                  <Crown className="h-2 w-2 mr-1" />
                  PRO
                </Badge>
              )}
            </div>
          )}

          {/* Location */}
          {(prestador.endereco_cidade || prestador.endereco_bairro) && (
            <div className="flex items-center gap-1 text-gray-500 mt-1">
              <MapPin className="h-3 w-3" />
              <span className="text-xs truncate">
                {prestador.endereco_bairro && `${prestador.endereco_bairro}, `}
                {prestador.endereco_cidade}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Service Description */}
      {prestador.descricao_servico && (
        <div className="px-1">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {prestador.descricao_servico}
          </p>
        </div>
      )}

      {/* Premium Benefits */}
      {isPremium && (
        <div className="p-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2 text-xs text-amber-800">
            <Shield className="h-3 w-3" />
            <span>Prestador Verificado</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="acoes">
        <button
          onClick={() => onContact(prestador)}
          className="btn-primario"
        >
          <MessageCircle className="inline h-4 w-4 mr-2" />
          Contatar
        </button>
        
        <button
          onClick={() => onViewProfile(prestador)}
          className="btn-secundario"
        >
          Ver Perfil
        </button>
      </div>
    </div>
  );
};