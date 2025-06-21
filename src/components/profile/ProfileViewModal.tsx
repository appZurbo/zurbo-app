
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { CommentsList } from './CommentsList';
import { MapPin, Phone, Mail, Star, Crown, Shield } from 'lucide-react';
import { type UserProfile } from '@/utils/database';

interface ProfileViewModalProps {
  prestador: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileViewModal = ({ prestador, open, onOpenChange }: ProfileViewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={prestador.foto_url} />
              <AvatarFallback>{prestador.nome?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                {prestador.nome}
                {prestador.premium && (
                  <Crown className="h-5 w-5 text-yellow-500" />
                )}
              </h3>
              <p className="text-gray-600 capitalize">{prestador.tipo}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Localização</span>
                </div>
                <p className="text-gray-600">
                  {prestador.endereco_cidade || 'Não informado'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Avaliação</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(prestador.nota_media)} readonly size="sm" />
                  <span className="text-gray-600">
                    {prestador.nota_media.toFixed(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Premium */}
          {prestador.premium && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium text-yellow-800">Prestador Premium</span>
                  <Shield className="h-4 w-4 text-yellow-600" />
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Perfil verificado com garantia de qualidade
                </p>
              </CardContent>
            </Card>
          )}

          {/* Descrição */}
          {prestador.bio && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Sobre o profissional</h4>
                <p className="text-gray-600">{prestador.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Avaliações */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-4">Avaliações</h4>
              <CommentsList userId={prestador.id} />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
