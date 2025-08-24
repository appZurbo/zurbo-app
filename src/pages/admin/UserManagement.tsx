import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  Users, 
  Activity, 
  Mail, 
  Ban, 
  Star,
  Calendar,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useMobile } from '@/hooks/useMobile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/utils/toast";
import { UserProfile } from '@/types';

const UserManagement = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isMobile = useMobile();
  
  const [usuarios, setUsuarios] = useState<UserProfile[]>([]);
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const loadUsers = async () => {
    try {
      const { data: allUsers, error } = await supabase
        .from('users')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;

      const users = allUsers?.filter(user => user.tipo !== 'prestador') || [];
      const providers = allUsers?.filter(user => user.tipo === 'prestador') || [];

      setUsuarios(users as UserProfile[] || []);
      setPrestadores(providers as UserProfile[] || []);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      toast.error(`Erro ao carregar usuários: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const handleBanUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ em_servico: false } as any)
        .eq('id', userId);

      if (error) throw error;

      toast.success("Usuário banido - O usuário foi banido com sucesso.");
      
      loadUsers();
    } catch (error: any) {
      toast.error("Não foi possível banir o usuário.");
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ em_servico: true } as any)
        .eq('id', userId);

      if (error) throw error;

      toast.success("Usuário reativado - O usuário foi reativado com sucesso.");
      
      loadUsers();
    } catch (error: any) {
      toast.error("Não foi possível reativar o usuário.");
    }
  };

  const filteredUsuarios = usuarios.filter(user =>
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrestadores = prestadores.filter(user =>
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UserCard = ({ user, isPrestador = false }: { user: UserProfile; isPrestador?: boolean }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {user.foto_url ? (
              <img 
                src={user.foto_url} 
                alt={user.nome}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-500" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{user.nome}</h3>
                <Badge 
                  variant={user.em_servico ? "default" : "destructive"}
                  className={user.em_servico ? "text-green-600" : "text-red-600"}
                >
                  {user.em_servico ? 'Ativo' : 'Inativo'}
                </Badge>
                {isPrestador && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Prestador
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{user.email}</p>
              
              {isPrestador && (
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Tipo:</strong> {user.tipo}</p>
                  <p><strong>Premium:</strong> {user.premium ? 'Sim' : 'Não'}</p>
                  <p><strong>Cidade:</strong> {user.endereco_cidade || 'Não informado'}</p>
                  <p><strong>Cadastrado em:</strong> {new Date(user.criado_em).toLocaleDateString()}</p>
                  
                  {user.nota_media && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{user.nota_media.toFixed(1)} de avaliação</span>
                    </div>
                  )}
                  
                  {user.endereco_cidade && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.endereco_cidade}</span>
                    </div>
                  )}
                  
                  <p><strong>Serviços:</strong> {user.descricao_servico || 'Não informado'}</p>
                  <p><strong>Cadastrado em:</strong> {new Date(user.criado_em).toLocaleDateString()}</p>
                </div>
              )}
              
              {!isPrestador && (
                <div className="text-sm text-gray-600">
                  <p><strong>Tipo:</strong> {user.tipo}</p>
                  <p><strong>Premium:</strong> {user.premium ? 'Sim' : 'Não'}</p>
                  <p><strong>Cidade:</strong> {user.endereco_cidade || 'Não informado'}</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Cadastrado em {new Date(user.criado_em).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedUser(user)}
            >
              <Mail className="h-4 w-4 mr-1" />
              Contatar
            </Button>
            
            {user.em_servico ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBanUser(user.id)}
              >
                <Ban className="h-4 w-4 mr-1" />
                Banir
              </Button>
            ) : (
              <Button
                size="sm"
                variant="default"
                onClick={() => handleUnbanUser(user.id)}
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
                Gerenciamento de Usuários
              </h1>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                Gerencie usuários e prestadores da plataforma
              </p>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Pesquisar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="usuarios" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="usuarios" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuários ({filteredUsuarios.length})
              </TabsTrigger>
              <TabsTrigger value="prestadores" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Prestadores ({filteredPrestadores.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="usuarios">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando usuários...</p>
                  </div>
                ) : filteredUsuarios.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum usuário encontrado</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredUsuarios.map(user => (
                    <UserCard key={user.id} user={user} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="prestadores">
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
                  filteredPrestadores.map(user => (
                    <UserCard key={user.id} user={user} isPrestador={true} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Contact Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Contatar {selectedUser.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Email:</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(`mailto:${selectedUser.email}`, '_blank')}
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedUser(null)}
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

export default UserManagement;