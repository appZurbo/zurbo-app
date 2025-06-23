
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { listarFavoritos, removerFavorito, type Favorito } from '@/utils/database/favoritos';
import { useToast } from '@/hooks/use-toast';

const ListaFavoritos = () => {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    try {
      const dados = await listarFavoritos();
      setFavoritos(dados);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverFavorito = async (prestadorId: string) => {
    try {
      const sucesso = await removerFavorito(prestadorId);
      if (sucesso) {
        setFavoritos(prev => prev.filter(fav => fav.prestador_id !== prestadorId));
        toast({
          title: "Removido dos favoritos",
          description: "Prestador removido dos seus favoritos",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover dos favoritos",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Meus Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-500">Carregando favoritos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (favoritos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Meus Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-3">Você ainda não salvou nenhum prestador</p>
            <Button onClick={() => navigate('/prestadores')}>
              Explorar Prestadores
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Meus Favoritos ({favoritos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {favoritos.map((favorito) => (
            <div 
              key={favorito.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={favorito.prestador?.foto_url} />
                  <AvatarFallback>
                    {favorito.prestador?.nome?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {favorito.prestador?.nome}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    {favorito.prestador?.endereco_cidade && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {favorito.prestador.endereco_cidade}
                      </div>
                    )}
                    
                    {favorito.prestador?.nota_media && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        {favorito.prestador.nota_media.toFixed(1)}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Salvo em {new Date(favorito.criado_em).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/prestador/${favorito.prestador_id}`)}
                >
                  Ver Perfil
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoverFavorito(favorito.prestador_id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListaFavoritos;
