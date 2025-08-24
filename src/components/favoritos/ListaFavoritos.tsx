
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, MapPin, Phone, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Favorito {
  id: string;
  prestador_id: string;
  prestador: {
    id: string;
    nome: string;
    foto_url?: string;
    bio?: string;
    endereco_cidade?: string;
    endereco_bairro?: string;
    nota_media?: number;
    premium?: boolean;
  };
}

export const ListaFavoritos: React.FC = () => {
  const { profile } = useAuth();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadFavoritos();
    }
  }, [profile]);

  const loadFavoritos = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select(`
          id,
          prestador_id,
          prestador:users!favoritos_prestador_id_fkey (
            id,
            nome,
            foto_url,
            bio,
            endereco_cidade,
            endereco_bairro,
            nota_media,
            premium
          )
        `)
        .eq('cliente_id', profile.id);

      if (error) throw error;

      setFavoritos(data || []);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      toast.error('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const removerFavorito = async (favoritoId: string) => {
    try {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('id', favoritoId);

      if (error) throw error;

      setFavoritos(prev => prev.filter(f => f.id !== favoritoId));
      toast.success('Favorito removido');
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      toast.error('Erro ao remover favorito');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (favoritos.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum favorito ainda</h3>
          <p className="text-gray-600">Adicione prestadores aos seus favoritos para vê-los aqui.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Meus Favoritos ({favoritos.length})
          </CardTitle>
        </CardHeader>
      </Card>

      {favoritos.map((favorito) => (
        <Card key={favorito.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={favorito.prestador.foto_url} alt={favorito.prestador.nome} />
                <AvatarFallback className="bg-orange-100 text-orange-600">
                  {favorito.prestador.nome?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {favorito.prestador.nome}
                  </h3>
                  {favorito.prestador.premium && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      Premium
                    </Badge>
                  )}
                </div>

                {favorito.prestador.nota_media && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {favorito.prestador.nota_media.toFixed(1)}
                    </span>
                  </div>
                )}

                {(favorito.prestador.endereco_bairro || favorito.prestador.endereco_cidade) && (
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {[favorito.prestador.endereco_bairro, favorito.prestador.endereco_cidade]
                        .filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {favorito.prestador.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {favorito.prestador.bio}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removerFavorito(favorito.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
