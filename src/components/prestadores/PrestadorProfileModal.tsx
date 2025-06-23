
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Crown, MessageCircle, Calendar, Phone } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';

interface PrestadorProfileModalProps {
  prestador: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onContact: (prestador: UserProfile) => void;
  onSchedule?: (prestador: UserProfile) => void;
}

export const PrestadorProfileModal: React.FC<PrestadorProfileModalProps> = ({
  prestador,
  isOpen,
  onClose,
  onContact,
  onSchedule
}) => {
  if (!prestador) return null;

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

  const totalAvaliacoes = prestador.avaliacoes?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={prestador.foto_url} />
              <AvatarFallback className="bg-orange-500 text-white">
                {getInitials(prestador.nome)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{prestador.nome}</span>
                {prestador.premium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              {prestador.endereco_cidade && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {prestador.endereco_cidade}
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avaliação e Estatísticas */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              {!prestador.ocultar_nota && prestador.nota_media && (
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold text-green-700">
                    {prestador.nota_media.toFixed(1)}
                  </span>
                </div>
              )}
              <p className="text-sm text-gray-600">{totalAvaliacoes} avaliações</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {getPrecoRange()}
              </div>
              <p className="text-sm text-gray-600">Faixa de preço</p>
            </div>
          </div>

          {/* Serviços */}
          {prestador.prestador_servicos && prestador.prestador_servicos.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Serviços Oferecidos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prestador.prestador_servicos.map((servico, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: servico.servicos?.cor || '#f97316' }}
                      />
                      <span className="font-medium">{servico.servicos?.nome}</span>
                    </div>
                    {servico.preco_min && servico.preco_max && (
                      <p className="text-sm text-gray-600">
                        R$ {servico.preco_min} - R$ {servico.preco_max}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {prestador.bio && (
            <div>
              <h3 className="font-semibold mb-2">Sobre</h3>
              <p className="text-gray-700">{prestador.bio}</p>
            </div>
          )}

          {/* Endereço Completo */}
          {(prestador.endereco_rua || prestador.endereco_bairro) && (
            <div>
              <h3 className="font-semibold mb-2">Localização</h3>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <div className="text-sm text-gray-600">
                  {prestador.endereco_rua && prestador.endereco_numero && (
                    <p>{prestador.endereco_rua}, {prestador.endereco_numero}</p>
                  )}
                  {prestador.endereco_bairro && (
                    <p>{prestador.endereco_bairro}</p>
                  )}
                  {prestador.endereco_cidade && (
                    <p>{prestador.endereco_cidade}</p>
                  )}
                  {prestador.endereco_cep && (
                    <p>CEP: {prestador.endereco_cep}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Avaliações Recentes */}
          {prestador.avaliacoes && prestador.avaliacoes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Avaliações Recentes</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {prestador.avaliacoes.slice(0, 5).map((avaliacao, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < avaliacao.nota 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {avaliacao.avaliador && (
                        <span className="text-sm font-medium">
                          {avaliacao.avaliador.nome}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(avaliacao.criado_em).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {avaliacao.comentario && (
                      <p className="text-sm text-gray-700">{avaliacao.comentario}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => onContact(prestador)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar Mensagem
            </Button>
            {onSchedule && (
              <Button
                onClick={() => onSchedule(prestador)}
                variant="outline"
                className="flex-1"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Solicitar Serviço
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
