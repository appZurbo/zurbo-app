
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Star, MapPin, MessageCircle, Eye, Heart, Phone, Mail } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';
import BotaoFavorito from '@/components/favoritos/BotaoFavorito';
import { IconeDestaque } from './IconeDestaque';

interface PrestadorCardImprovedProps {
  prestador: UserProfile;
  onContact: (prestador: UserProfile) => void;
}

export const PrestadorCardImproved: React.FC<PrestadorCardImprovedProps> = ({
  prestador,
  onContact
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  // Simular galeria de fotos (em um caso real, viria do portfolio do prestador)
  const galeriaFotos = [
    prestador.foto_url,
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ].filter(Boolean);

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          {/* Header com Avatar e Favorito */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={prestador.foto_url} alt={prestador.nome} />
                <AvatarFallback>
                  {prestador.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {prestador.nome}
                  </h3>
                  <IconeDestaque isDestaque={prestador.premium} />
                  {prestador.premium && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">Premium</Badge>
                  )}
                </div>
                
                {prestador.endereco_cidade && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {prestador.endereco_cidade}
                      {prestador.endereco_bairro && `, ${prestador.endereco_bairro}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <BotaoFavorito prestadorId={prestador.id} />
          </div>

          {/* Bio */}
          {prestador.bio && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {prestador.bio}
            </p>
          )}

          {/* Serviços */}
          {servicos.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Serviços oferecidos:</h4>
              <div className="flex flex-wrap gap-2">
                {servicos.slice(0, 4).map((servico, index) => (
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
                {servicos.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{servicos.length - 4} mais
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Avaliação e Preço */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(prestador.nota_media || 0)}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {prestador.nota_media?.toFixed(1) || '0.0'}
              </span>
              {prestador.avaliacoes && prestador.avaliacoes.length > 0 && (
                <span className="text-xs text-gray-500">
                  ({prestador.avaliacoes.length} avaliações)
                </span>
              )}
            </div>

            {precoMin > 0 && precoMax > 0 && (
              <div className="text-right">
                <span className="text-sm text-gray-500">A partir de</span>
                <div className="text-lg font-bold text-green-600">
                  R$ {precoMin === precoMax ? precoMin : `${precoMin} - ${precoMax}`}
                </div>
              </div>
            )}
          </div>

          {/* Galeria de Fotos */}
          {galeriaFotos.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Trabalhos realizados:</h4>
              <div className="grid grid-cols-4 gap-2">
                {galeriaFotos.slice(0, 4).map((foto, index) => (
                  <div 
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedImage(foto)}
                  >
                    <img 
                      src={foto} 
                      alt={`Trabalho ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(`tel:${prestador.telefone}`, '_self')}
            >
              <Phone className="h-4 w-4 mr-1" />
              Ligar
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={() => onContact(prestador)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Contatar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Imagem */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Trabalho realizado por {prestador.nome}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex justify-center">
              <img 
                src={selectedImage} 
                alt="Trabalho realizado"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
