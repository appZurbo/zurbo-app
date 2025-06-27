
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import { MapPin, Star, Crown, Shield, MessageCircle, Phone } from 'lucide-react';
import { type UserProfile } from '@/utils/database/types';

interface EnhancedPrestadorModalProps {
  prestador: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContact: (prestador: UserProfile) => void;
}

export const EnhancedPrestadorModal = ({ 
  prestador, 
  open, 
  onOpenChange, 
  onContact 
}: EnhancedPrestadorModalProps) => {
  const mockGallery = [
    '/lovable-uploads/23923192-d3bc-4751-82d3-665cae0d614f.jpg',
    '/lovable-uploads/324802ef-8854-41f3-ab47-ed00e0f52df9.png',
    '/lovable-uploads/4d14f71d-55b2-460f-8647-4b565a382aef.png'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        {/* Header with slightly darkened background effect */}
        <div className="absolute inset-0 bg-black bg-opacity-20 -z-10" />
        
        <DialogHeader className="relative">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20 border-2 border-white shadow-lg">
              <AvatarImage src={prestador.foto_url} alt={prestador.nome} />
              <AvatarFallback className="text-xl bg-orange-100 text-orange-600">
                {prestador.nome?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                {prestador.nome}
                {prestador.premium && (
                  <Crown className="h-5 w-5 text-yellow-500" />
                )}
              </DialogTitle>
              <p className="text-gray-600 capitalize mb-2">{prestador.tipo}</p>
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(prestador.nota_media || 0)} readonly size="sm" />
                <span className="text-gray-600 font-medium">
                  {(prestador.nota_media || 0).toFixed(1)} ({prestador.avaliacoes?.length || 0} avaliações)
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-sm">Localização</p>
                <p className="text-gray-600 text-sm">
                  {prestador.endereco_cidade || 'Localização não informada'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Star className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-sm">Avaliação Média</p>
                <p className="text-gray-600 text-sm">
                  {(prestador.nota_media || 0).toFixed(1)} estrelas
                </p>
              </div>
            </div>
          </div>

          {/* Premium Status */}
          {prestador.premium && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-yellow-800">Prestador Premium</span>
                <Shield className="h-4 w-4 text-yellow-600" />
              </div>
              <p className="text-yellow-700 text-sm">
                Perfil verificado com garantia de qualidade e atendimento diferenciado
              </p>
            </div>
          )}

          {/* Service Description */}
          {prestador.bio && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-orange-500" />
                Sobre os Serviços
              </h4>
              <p className="text-gray-700 leading-relaxed">{prestador.bio}</p>
            </div>
          )}

          {/* Services Offered */}
          {prestador.prestador_servicos && prestador.prestador_servicos.length > 0 && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Serviços Oferecidos</h4>
              <div className="flex flex-wrap gap-2">
                {prestador.prestador_servicos.map((servico, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-orange-100 text-orange-800 border-orange-200"
                  >
                    {servico.servicos?.nome || 'Serviço'}
                    {servico.preco_min && servico.preco_max && (
                      <span className="ml-1 text-xs">
                        (R$ {servico.preco_min} - R$ {servico.preco_max})
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Galeria de Trabalhos</h4>
            <div className="grid grid-cols-3 gap-2">
              {mockGallery.map((image, index) => (
                <div 
                  key={index}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-sm"
                >
                  <img 
                    src={image} 
                    alt={`Trabalho ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Foto';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          {prestador.avaliacoes && prestador.avaliacoes.length > 0 && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Avaliações Recentes</h4>
              <div className="space-y-3">
                {prestador.avaliacoes.slice(0, 3).map((avaliacao, index) => (
                  <div key={index} className="border-l-4 border-orange-200 pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={avaliacao.nota} readonly size="sm" />
                      <span className="text-sm font-medium">
                        {avaliacao.avaliador?.nome || 'Cliente'}
                      </span>
                    </div>
                    {avaliacao.comentario && (
                      <p className="text-gray-600 text-sm">{avaliacao.comentario}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={() => {
                onContact(prestador);
                onOpenChange(false);
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Entrar em Contato
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
