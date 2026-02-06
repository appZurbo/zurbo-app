import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Tag,
  Award,
  Clock,
  MapPin,
  MessageCircle,
  Calendar,
  CheckCircle,
  Verified
} from 'lucide-react';
import { UserProfile } from '@/utils/database/types';

interface ModernProviderProfileProps {
  prestador: UserProfile;
  avaliacoes: any[];
  onContact: () => void;
  onSchedule: () => void;
}

export const ModernProviderProfile: React.FC<ModernProviderProfileProps> = ({
  prestador,
  avaliacoes,
  onContact,
  onSchedule
}) => {
  const navigate = useNavigate();
  const rating = prestador.nota_media || 0;
  const totalAvaliacoes = avaliacoes.length;

  // Mock data for demonstration
  const experience = '12 Anos';
  const responseTime = '~15 min';
  const distance = '1.8 km';
  const priceRange = prestador.preco_min && prestador.preco_max
    ? `R$ ${prestador.preco_min} - ${prestador.preco_max}`
    : prestador.preco_min
      ? `R$ ${prestador.preco_min}`
      : 'Consulte';

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF7F2] font-sans text-[#3D342B] overflow-x-hidden">
      {/* Banner Image */}
      <div className="relative h-80 w-full">
        <img
          src={prestador.foto_url || `https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=${encodeURIComponent(prestador.nome || 'Prestador')}`}
          className="w-full h-full object-cover"
          alt={prestador.nome}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Header with back and share */}
        <div className="absolute top-0 left-0 right-0 px-5 pt-12 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
            onClick={() => navigate('/prestadores')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
              onClick={() => {
                navigator.share?.({
                  title: `${prestador.nome} - Zurbo`,
                  text: `Confira o perfil de ${prestador.nome}`,
                  url: window.location.href
                });
              }}
            >
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 -mt-10 bg-[#FBF7F2] rounded-t-[40px] relative z-10 px-5 pt-8 pb-32 overflow-y-auto">
        {/* Profile Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-[#3D342B]">{prestador.nome}</h1>
              {prestador.premium && (
                <Verified className="h-6 w-6 text-blue-500" />
              )}
            </div>
            <p className="text-[#8C7E72] font-medium mb-3">
              {prestador.servicos_oferecidos?.[0] || prestador.tipo || 'Prestador de Serviços'}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{rating.toFixed(1)}</span>
              </div>
              <span className="text-[#8C7E72] text-sm">({totalAvaliacoes} avaliações)</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-white shadow-md text-[#E05815] hover:bg-[#FEE8D6]"
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Card className="p-4 bg-white rounded-2xl shadow-sm border border-[#E6DDD5]/50">
            <div className="flex items-center gap-2 text-[#E05815] mb-1">
              <Tag className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Preço</span>
            </div>
            <span className="font-bold text-[#3D342B]">{priceRange}</span>
          </Card>

          <Card className="p-4 bg-white rounded-2xl shadow-sm border border-[#E6DDD5]/50">
            <div className="flex items-center gap-2 text-[#E05815] mb-1">
              <Award className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Exp.</span>
            </div>
            <span className="font-bold text-[#3D342B]">{experience}</span>
          </Card>

          <Card className="p-4 bg-white rounded-2xl shadow-sm border border-[#E6DDD5]/50">
            <div className="flex items-center gap-2 text-[#E05815] mb-1">
              <Clock className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Resposta</span>
            </div>
            <span className="font-bold text-[#3D342B]">{responseTime}</span>
          </Card>

          <Card className="p-4 bg-white rounded-2xl shadow-sm border border-[#E6DDD5]/50">
            <div className="flex items-center gap-2 text-[#E05815] mb-1">
              <MapPin className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Distância</span>
            </div>
            <span className="font-bold text-[#3D342B]">{distance}</span>
          </Card>
        </div>

        {/* About Section */}
        {prestador.bio && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#3D342B] mb-3">Sobre</h2>
            <p className="text-[#8C7E72] leading-relaxed">
              {prestador.bio}
            </p>
          </div>
        )}

        {/* Services Offered */}
        {prestador.prestador_servicos && prestador.prestador_servicos.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#3D342B]">Serviços Oferecidos</h2>
              <Badge className="text-xs font-bold text-[#E05815] px-2 py-1 bg-[#E05815]/10 rounded-md">
                {prestador.prestador_servicos.length} Disponíveis
              </Badge>
            </div>
            <div className="space-y-3">
              {prestador.prestador_servicos.map((servico: any, index: number) => (
                <Card key={index} className="p-4 bg-white rounded-2xl flex justify-between items-center shadow-sm border border-[#E6DDD5]/40">
                  <div>
                    <h4 className="font-bold text-[#3D342B]">{servico.servicos?.nome || 'Serviço'}</h4>
                    {servico.descricao && (
                      <p className="text-xs text-[#8C7E72]">{servico.descricao}</p>
                    )}
                  </div>
                  {servico.preco_min && (
                    <span className="font-bold text-[#E05815]">
                      R$ {servico.preco_min}
                      {servico.preco_max && ` - ${servico.preco_max}`}
                    </span>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {avaliacoes.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#3D342B]">Avaliações</h2>
              <button className="text-sm text-[#E05815] font-semibold hover:underline">
                Ver todas
              </button>
            </div>
            <div className="space-y-4">
              {avaliacoes.slice(0, 2).map((avaliacao: any, index: number) => (
                <Card key={index} className="p-4 bg-white rounded-2xl shadow-sm border border-[#E6DDD5]/30">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={avaliacao.foto_url || `https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=${encodeURIComponent(avaliacao.nome || 'Cliente')}`}
                        className="h-10 w-10 rounded-full"
                        alt="Reviewer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[#3D342B]">
                          {avaliacao.nome || 'Cliente'}
                        </h4>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < (avaliacao.nota || 5)
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-[#E6DDD5]'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8C7E72] font-medium">
                      Há {index + 1} {index === 0 ? 'dia' : 'dias'}
                    </span>
                  </div>
                  {avaliacao.comentario && (
                    <p className="text-sm text-[#8C7E72]">
                      {avaliacao.comentario}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-24 right-5 flex flex-col gap-3 z-50">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-[#E05815] text-white shadow-lg shadow-[#E05815]/30 border-4 border-[#FBF7F2] hover:bg-[#E05815]/90"
          onClick={onContact}
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FBF7F2]/80 backdrop-blur-lg border-t border-[#E6DDD5] px-5 py-4 flex items-center gap-4 z-50">
        <div className="flex-1">
          <Button
            className="w-full bg-[#E05815] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#E05815]/20 hover:bg-[#E05815]/90 transition-all active:scale-[0.98]"
            onClick={onSchedule}
            size="lg"
          >
            Contratar Serviço
          </Button>
        </div>
      </div>
    </div>
  );
};
