
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Crown, Eye, MessageCircle, Map } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';
import { PrestadorMapCard } from '@/components/maps/PrestadorMapCard';

interface PrestadorCardProps {
  prestador: UserProfile;
  onViewProfile: (prestador: UserProfile) => void;
  onContact: (prestador: UserProfile) => void;
  onCardClick?: (prestador: UserProfile) => void;
}

export const PrestadorCard: React.FC<PrestadorCardProps> = ({
  prestador,
  onViewProfile,
  onContact,
  onCardClick
}) => {
  const [showMap, setShowMap] = useState(false);

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getPrecoRange = () => {
    if (!prestador.prestador_servicos || prestador.prestador_servicos.length === 0) {
      return 'Consultar preço';
    }

    const precos = prestador.prestador_servicos
      .filter(ps => ps.preco_min && ps.preco_max)
      .map(ps => ({ min: ps.preco_min!, max: ps.preco_max! }));

    if (precos.length === 0) return 'Consultar preço';

    const minPreco = Math.min(...precos.map(p => p.min));
    const maxPreco = Math.max(...precos.map(p => p.max));

    return `R$ ${minPreco} - R$ ${maxPreco}`;
  };

  const getServicos = () => {
    if (!prestador.prestador_servicos || prestador.prestador_servicos.length === 0) {
      return [];
    }

    return prestador.prestador_servicos
      .filter(ps => ps.servicos)
      .map(ps => ps.servicos!.nome)
      .slice(0, 2);
  };

  const totalAvaliacoes = prestador.avaliacoes?.length || 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    if (onCardClick) {
      onCardClick(prestador);
    }
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        {prestador.premium && (
          <Badge className="absolute top-2 right-2 z-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )}
        
        <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-orange-200 rounded-t-lg flex items-center justify-center overflow-hidden">
          {prestador.foto_url ? (
            <img 
              src={prestador.foto_url} 
              alt={prestador.nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {getInitials(prestador.nome)}
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
              {prestador.nome}
            </h3>
            {prestador.endereco_cidade && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {prestador.endereco_cidade}
              </div>
            )}
          </div>
          
          {!prestador.ocultar_nota && prestador.nota_media && (
            <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
              <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
              <span className="text-sm font-medium text-green-700">
                {prestador.nota_media.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Serviços */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1 mb-2">
            {getServicos().map((servico, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {servico}
              </Badge>
            ))}
            {prestador.prestador_servicos && prestador.prestador_servicos.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{prestador.prestador_servicos.length - 2} mais
              </Badge>
            )}
          </div>
          
          <div className="text-sm font-medium text-orange-600">
            {getPrecoRange()}
          </div>
        </div>

        {/* Bio */}
        {prestador.bio && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {prestador.bio}
          </p>
        )}

        {/* Mapa */}
        {showMap && (
          <div className="mb-3">
            <PrestadorMapCard prestador={prestador} height="150px" />
          </div>
        )}

        {/* Estatísticas - Expandido */}
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-600">{totalAvaliacoes} avaliações</span>
              {prestador.endereco_bairro && (
                <div className="text-xs text-gray-500 mt-1">
                  {prestador.endereco_bairro}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {prestador.premium && (
                <span className="text-yellow-600 font-medium text-xs">Premium</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMap(!showMap);
                }}
                className="h-6 px-2 text-xs"
              >
                <Map className="h-3 w-3 mr-1" />
                {showMap ? 'Ocultar' : 'Mapa'}
              </Button>
            </div>
          </div>
          
          {/* Preview dos serviços */}
          {prestador.prestador_servicos && prestador.prestador_servicos.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: prestador.prestador_servicos[0].servicos?.cor || '#f97316' }}
                />
                <span className="text-gray-600">
                  {prestador.prestador_servicos[0].servicos?.nome}
                </span>
                {prestador.prestador_servicos[0].preco_min && (
                  <span className="ml-auto text-orange-600 font-medium">
                    R$ {prestador.prestador_servicos[0].preco_min}+
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile(prestador);
            }}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Perfil Completo
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onContact(prestador);
            }}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Contatar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
