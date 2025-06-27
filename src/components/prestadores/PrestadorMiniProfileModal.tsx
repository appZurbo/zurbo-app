
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, X } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';

interface PrestadorMiniProfileModalProps {
  prestador: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onContact: (prestador: UserProfile) => void;
}

export const PrestadorMiniProfileModal: React.FC<PrestadorMiniProfileModalProps> = ({
  prestador,
  isOpen,
  onClose,
  onContact
}) => {
  if (!prestador) return null;

  const handleContact = () => {
    onContact(prestador);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 bg-white rounded-2xl shadow-xl border-0">
        <div className="relative p-6">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header with photo, name, category */}
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-20 w-20 border-2 border-orange-100">
              <AvatarImage src={prestador.foto_url} alt={prestador.nome} />
              <AvatarFallback className="text-xl bg-orange-100 text-orange-600">
                {prestador.nome?.charAt(0)?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800 mb-1">{prestador.nome}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {prestador.endereco_cidade || 'Sinop, MT'}
              </p>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-yellow-600">
                  {prestador.nota_media?.toFixed(1) || '0.0'}
                </span>
                <span className="text-sm text-gray-500">
                  (Avaliações)
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {prestador.bio && (
            <div className="mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {prestador.bio}
              </p>
            </div>
          )}

          {/* Services */}
          {prestador.prestador_servicos && prestador.prestador_servicos.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {prestador.prestador_servicos.slice(0, 3).map((servico: any, index: number) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 text-xs px-3 py-1"
                  >
                    {servico.servicos?.nome || 'Serviço'}
                  </Badge>
                ))}
                {prestador.prestador_servicos.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{prestador.prestador_servicos.length - 3} mais
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Gallery Preview (if available) */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-2">
              {/* Placeholder gallery images */}
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="aspect-square bg-gray-100 rounded-md flex items-center justify-center"
                >
                  <span className="text-gray-400 text-xs">Foto {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Button */}
          <Button 
            onClick={handleContact}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-xl"
          >
            Entrar em Contato
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
