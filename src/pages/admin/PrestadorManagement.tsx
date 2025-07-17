
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  Activity, 
  Mail, 
  Ban, 
  Star,
  Calendar,
  MapPin,
  Camera,
  Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useMobile } from '@/hooks/useMobile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types';

const PrestadorManagement = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();
  
  const [prestadores, setPrestadores] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPrestador, setSelectedPrestador] = useState<Profile | null>(null);

  const loadPrestadores = async () => {
    try {
      const { data: providers, error } = await supabase
        .from('users')
        .select('*')
        .eq('tipo', 'prestador')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPrestadores(providers || []);
    } catch (error: any) {
      console.error('Erro ao carregar prestadores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de prestadores.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadPrestadores();
    }
  }, [isAdmin]);

  const handleBanPrestador = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ ativo: false })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Prestador banido",
        description: "O prestador foi banido com sucesso."
      });
      
      loadPrestadores();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível banir o prestador.",
        variant: "destructive"
      });
    }
  };

  const handleUnbanPrestador = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ ativo: true })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Prestador reativado",
        description: "O prestador foi reativado com sucesso."
      });
      
      loadPrestadores();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível reativar o prestador.",
        variant: "destructive"
      });
    }
  };

  const filteredPrestadores = prestadores.filter(user =>
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.categoria_servico?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PrestadorCard = ({ prestador }: { prestador: Profile }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {prestador.foto_url ? (
              <img 
                src={prestador.foto_url} 
                alt={prestador.nome}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <Wrench className="h-8 w-8 text-gray-500" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{prestador.nome}</h3>
                <Badge variant={prestador.ativo ? "default" : "destructive"}>
                  {prestador.ativo ? "Ativo" : "Banido"}
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  <Wrench className="h-3 w-3 mr-1" />
                  Prestador
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{prestador.email}</p>
              
              {prestador.categoria_servico && (
                <p className="text-sm font-medium text-orange-600 mb-2">
                  {prestador.categoria_servico}
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                {prestador.nota_media && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{prestador.nota_media.toFixed(1)} de avaliação</span>
                  </div>
                )}
                
                {prestador.endereco_cidade && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{prestador.endereco_cidade}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Desde {new Date(prestador.created_at).toLocaleDateString()}</span>
                </div>

                {prestador.portfolio_fotos && (
                  <div className="flex items-center gap-1">
                    <Camera className="h-4 w-4" />
                    <span>
                      {JSON.parse(prestador.portfolio_fotos).length || 0} fotos
                    </span>
                  </div>
                )}
              </div>

              {prestador.bio && (
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {prestador.bio}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedPrestador(prestador)}
            >
              <Mail className="h-4 w-4 mr-1" />
              Contatar
            </Button>
            
            {prestador.ativo ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBanPrestador(prestador.id)}
              >
                <Ban className="h-4 w-4 mr-1" />
                Banir
              </Button>
            ) : (
              <Button
                size="sm"
                variant="default"
                onClick={() => handleUnbanPrestador(prestador.id)}
              >
                <Activity className="h-4 w-4 mr-1" />
                Reativar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!isAdmin) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Esta página é exclusiva para administradores.
              </p>
              <Button onClick={() => navigate('/')}>
                Voltar à Página Inicial
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UnifiedHeader />
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-7xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/relatorios')}
              className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && 'Voltar'}
            </Button>
            <div>
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                Gerenciamento de Prestadores
              </h1>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                Gerencie prestadores de serviço da plataforma
              </p>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Pesquisar por nome, email ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{prestadores.length}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {prestadores.filter(p => p.ativo).length}
                  </p>
                  <p className="text-sm text-gray-600">Ativos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {prestadores.filter(p => !p.ativo).length}
                  </p>
                  <p className="text-sm text-gray-600">Banidos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {(prestadores.reduce((acc, p) => acc + (p.nota_media || 0), 0) / prestadores.length || 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">Média Geral</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prestadores List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando prestadores...</p>
              </div>
            ) : filteredPrestadores.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum prestador encontrado</p>
                </CardContent>
              </Card>
            ) : (
              filteredPrestadores.map(prestador => (
                <PrestadorCard key={prestador.id} prestador={prestador} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de contato de prestador */}
      {selectedPrestador && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Contatar {selectedPrestador.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Email:</p>
                  <p className="font-medium">{selectedPrestador.email}</p>
                </div>
                
                {selectedPrestador.categoria_servico && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Categoria:</p>
                    <p className="font-medium">{selectedPrestador.categoria_servico}</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(`mailto:${selectedPrestador.email}`, '_blank')}
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPrestador(null)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PrestadorManagement;
