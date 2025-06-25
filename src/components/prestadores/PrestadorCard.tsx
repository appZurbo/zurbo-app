
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, MessageCircle, Eye, Heart } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';
import BotaoFavorito from '@/components/favoritos/BotaoFavorito';
import { IconeDestaque } from './IconeDestaque';
import { verificarClassificacao, ClassificacaoPrestador } from '@/utils/database/classificacao';

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
  const [classificacao, setClassificacao] = useState<ClassificacaoPrestador | null>(null);

  useEffect(() => {
    const carregarClassificacao = async () => {
      const classif = await verificarClassificacao(prestador.id);
      setClassificacao(classif);
    };

    carregarClassificacao();
  }, [prestador.id]);

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(prestador);
    }
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewProfile(prestador);
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContact(prestador);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const servicos = prestador.prestador_servicos || [];
  const precoMin = servicos.length > 0 ? Math.min(...servicos.map(s => s.preco_min || 0)) : 0;
  const precoMax = servicos.length > 0 ? Math.max(...servicos.map(s => s.preco_max || 0)) : 0;

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        {/* Header com Avatar e Ícone de Destaque */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={prestador.foto_url} alt={prestador.nome} />
              <AvatarFallback>
                {prestador.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {prestador.nome}
                </h3>
                <IconeDestaque isDestaque={classificacao?.tipo === 'destaque'} />
                {prestador.premium && (
                  <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                )}
              </div>
              
              {prestador.endereco_cidade && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-gray-500" />
                  <span className="text-sm text-gray-600">{prestador.endereco_cidade}</span>
                </div>
              )}
            </div>
          </div>

          <BotaoFavorito prestadorId={prestador.id} />
        </div>

        {/* Bio */}
        {prestador.bio && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {prestador.bio}
          </p>
        )}

        {/* Serviços */}
        {servicos.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {servicos.slice(0, 3).map((servico, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${servico.servicos?.cor}20`,
                    color: servico.servicos?.cor 
                  }}
                >
                  {servico.servicos?.nome}
                </Badge>
              ))}
              {servicos.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{servicos.length - 3} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Avaliação e Preço */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {renderStars(prestador.nota_media || 0)}
            <span className="text-sm text-gray-600 ml-1">
              {prestador.nota_media?.toFixed(1) || '0.0'}
            </span>
            {prestador.avaliacoes && prestador.avaliacoes.length > 0 && (
              <span className="text-xs text-gray-500">
                ({prestador.avaliacoes.length})
              </span>
            )}
          </div>

          {precoMin > 0 && precoMax > 0 && (
            <div className="text-right">
              <span className="text-sm font-medium text-green-600">
                R$ {precoMin === precoMax ? precoMin : `${precoMin} - ${precoMax}`}
              </span>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleViewProfile}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Perfil
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            onClick={handleContact}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Contatar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
