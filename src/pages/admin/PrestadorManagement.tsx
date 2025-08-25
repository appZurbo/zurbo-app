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
import { UserProfile } from '@/types';

interface Filters {
  search: string;
  status: 'all' | 'active' | 'inactive';
  category: string;
}

const PrestadorManagement = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();
  
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [filteredPrestadores, setFilteredPrestadores] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrestador, setSelectedPrestador] = useState<UserProfile | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    category: ''
  });

  const loadPrestadores = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('tipo', 'prestador')
        .order('criado_em', { ascending: false });

      if (error) throw error;

      setPrestadores(data as UserProfile[] || []);
      setFilteredPrestadores(data as UserProfile[] || []);
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

  const toggleUserStatus = async (id: string, isActive: boolean | undefined) => {
    try {
      if (isActive) {
        const { error } = await supabase
          .from('users')
          .update({ em_servico: false } as any)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Prestador suspenso",
          description: "O prestador foi suspenso com sucesso."
        });
      } else {
        const { error } = await supabase
          .from('users')
          .update({ em_servico: true } as any)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Prestador ativado",
          description: "O prestador foi ativado com sucesso."
        });
      }
      
      loadPrestadores();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do prestador.",
        variant: "destructive"
      });
    }
  };

  const getPortfolioPhotosCount = (prestador: UserProfile) => {
    if (!prestador.portfolio_fotos) return 0;
    try {
      const photos = typeof prestador.portfolio_fotos === 'string' 
        ? JSON.parse(prestador.portfolio_fotos)
        : prestador.portfolio_fotos;
      return Array.isArray(photos) ? photos.length : 0;
    } catch {
      return 0;
    }
  };

  const PrestadorCard = ({ prestador }: { prestador: UserProfile }) => (
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
                <Badge 
                  variant={prestador.em_servico ? "default" : "destructive"}
                  className={prestador.em_servico ? "text-green-600" : "text-red-600"}
                >
                  {prestador.em_servico ? 'Ativo' : 'Inativo'}
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  <Wrench className="h-3 w-3 mr-1" />
                  Prestador
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{prestador.email}</p>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><strong>Categoria:</strong> {prestador.descricao_servico || 'Não informado'}</p>
                  <p><strong>Descrição:</strong> {prestador.bio || 'Não informado'}</p>
                  <p><strong>Status:</strong> {prestador.em_servico ? 'Ativo' : 'Inativo'}</p>
                  
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
                    <span>Desde {new Date(prestador.criado_em).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Camera className="h-4 w-4" />
                    <span>{getPortfolioPhotosCount(prestador)} fotos</span>
                  </div>
                </div>

                {prestador.portfolio_fotos && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Portfólio:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {(() => {
                        try {
                          const fotos = typeof prestador.portfolio_fotos === 'string' ? 
                            JSON.parse(prestador.portfolio_fotos) : prestador.portfolio_fotos;
                          return fotos.slice(0, 4).map((foto: any, index: number) => (
                            <img 
                              key={index}
                              src={foto.url} 
                              alt={`Portfólio ${index + 1}`}
                              className="w-16 h-16 object-cover rounded border"
                            />
                          ));
                        } catch {
                          return null;
                        }
                      })()}
                    </div>
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
            
            {prestador.em_servico ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => toggleUserStatus(prestador.id, prestador.em_servico)}
              >
                <Ban className="h-4 w-4 mr-1" />
                Suspender
              </Button>
            ) : (
              <Button
                size="sm"
                variant="default"
                onClick={() => toggleUserStatus(prestador.id, prestador.em_servico)}
              >
                <Activity className="h-4 w-4 mr-1" />
                Ativar
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

  // Filter logic
  useEffect(() => {
    let filtered = prestadores
      .filter(prestador => 
        prestador.nome?.toLowerCase().includes(filters.search.toLowerCase()) ||
        prestador.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        prestador.descricao_servico?.toLowerCase().includes(filters.search.toLowerCase())
      )
      .filter(prestador => 
        filters.category === '' || 
        prestador.descricao_servico?.toLowerCase().includes(filters.category.toLowerCase())
      )
      .filter(prestador => 
        filters.status === 'all' || 
        (filters.status === 'active' ? prestador.em_servico : !prestador.em_servico)
      );

    setFilteredPrestadores(filtered);
  }, [prestadores, filters]);

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

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Pesquisar por nome, email..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="pl-10"
                  />
                </div>
                <Input
                  placeholder="Filtrar por categoria..."
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                />
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value as any})}
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Apenas ativos</option>
                  <option value="inactive">Apenas inativos</option>
                </select>
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
                    {prestadores.filter(p => p.em_servico).length}
                  </p>
                  <p className="text-sm text-gray-600">Ativos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {prestadores.filter(p => !p.em_servico).length}
                  </p>
                  <p className="text-sm text-gray-600">Inativos</p>
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

      {/* Contact Modal */}
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
                
                {selectedPrestador.descricao_servico && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Categoria:</p>
                    <p className="font-medium">{selectedPrestador.descricao_servico}</p>
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