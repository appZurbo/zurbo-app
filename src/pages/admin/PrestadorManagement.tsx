import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  UserX, 
  CheckCircle, 
  XCircle,
  MapPin,
  Star,
  Phone,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Prestador {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  foto_perfil?: string;
  verificado?: boolean;
  ativo?: boolean;
  endereco_cidade?: string;
  endereco_bairro?: string;
  cidade?: string;
  bairro?: string;
  servicos?: string[];
  media_avaliacoes?: number;
  total_avaliacoes?: number;
  created_at?: string;
}

const PrestadorManagement = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified' | 'active' | 'inactive'>('all');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadPrestadores();
  }, [isAdmin, navigate]);

  const loadPrestadores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('tipo', 'prestador')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match interface
      const transformedData = (data || []).map((user: any) => ({
        ...user,
        cidade: user.endereco_cidade,
        bairro: user.endereco_bairro,
        verificado: user.verificado || false,
        ativo: user.ativo !== false
      }));
      
      setPrestadores(transformedData);
    } catch (error) {
      console.error('Error loading prestadores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prestadores.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (prestadorId: string, field: 'verificado' | 'ativo', value: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ [field]: value })
        .eq('id', prestadorId);

      if (error) throw error;

      setPrestadores(prev => 
        prev.map(p => 
          p.id === prestadorId 
            ? { ...p, [field]: value }
            : p
        )
      );

      toast({
        title: "Sucesso",
        description: `Status do prestador ${value ? 'ativado' : 'desativado'} com sucesso.`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  };

  const filteredPrestadores = prestadores.filter(prestador => {
    const matchesSearch = 
      prestador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestador.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestador.bairro?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'verified' && prestador.verificado) ||
      (filterStatus === 'unverified' && !prestador.verificado) ||
      (filterStatus === 'active' && prestador.ativo) ||
      (filterStatus === 'inactive' && !prestador.ativo);

    return matchesSearch && matchesFilter;
  });

  if (!isAdmin) {
    return null;
  }

  return (
    <UnifiedLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Gerenciar Prestadores
              </h1>
              <p className="text-gray-600">
                Visualize e gerencie todos os prestadores de serviço
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, email, cidade..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                    size="sm"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterStatus === 'verified' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('verified')}
                    size="sm"
                  >
                    Verificados
                  </Button>
                  <Button
                    variant={filterStatus === 'active' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('active')}
                    size="sm"
                  >
                    Ativos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{prestadores.length}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {prestadores.filter(p => p.verificado || false).length}
                  </p>
                  <p className="text-sm text-gray-600">Verificados</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {prestadores.filter(p => p.ativo || true).length}
                  </p>
                  <p className="text-sm text-gray-600">Ativos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {filteredPrestadores.length}
                  </p>
                  <p className="text-sm text-gray-600">Filtrados</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prestadores List */}
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>Carregando prestadores...</p>
                </CardContent>
              </Card>
            ) : filteredPrestadores.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Nenhum prestador encontrado.</p>
                </CardContent>
              </Card>
            ) : (
              filteredPrestadores.map((prestador) => (
                <Card key={prestador.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={prestador.foto_perfil} />
                          <AvatarFallback>
                            {prestador.nome.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{prestador.nome}</h3>
                            {prestador.verificado && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verificado
                              </Badge>
                            )}
                            <Badge variant={(prestador.ativo ?? true) ? 'default' : 'secondary'}>
                              {(prestador.ativo ?? true) ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {prestador.email}
                            </div>
                            {prestador.telefone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {prestador.telefone}
                              </div>
                            )}
                            {prestador.cidade && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {prestador.cidade} - {prestador.bairro}
                              </div>
                            )}
                            {prestador.media_avaliacoes && (
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4" />
                                {prestador.media_avaliacoes.toFixed(1)} ({prestador.total_avaliacoes} avaliações)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/prestador/${prestador.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(prestador.id, 'verificado', !(prestador.verificado || false))}
                        >
                          {prestador.verificado ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(prestador.id, 'ativo', !(prestador.ativo ?? true))}
                        >
                          {(prestador.ativo ?? true) ? (
                            <UserX className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default PrestadorManagement;