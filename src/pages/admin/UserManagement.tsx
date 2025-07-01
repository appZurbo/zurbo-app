
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Search, Crown, Shield, User, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserRoleManager } from '@/components/admin/UserRoleManager';

interface UserData {
  id: string;
  nome: string;
  email: string;
  tipo: 'cliente' | 'prestador' | 'admin' | 'moderator';
  premium: boolean;
  criado_em: string;
  descricao_servico?: string;
  nota_media?: number;
  endereco_cidade?: string;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const handleTogglePremium = async (userId: string, currentPremium: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ premium: !currentPremium })
        .eq('id', userId);

      if (error) throw error;

      // Update usuarios_premium table
      if (!currentPremium) {
        await supabase
          .from('usuarios_premium')
          .upsert({
            usuario_id: userId,
            ativo: true,
            desde: new Date().toISOString(),
            expira_em: null
          });
      } else {
        await supabase
          .from('usuarios_premium')
          .update({ ativo: false })
          .eq('usuario_id', userId);
      }

      toast({
        title: "Status Premium atualizado",
        description: `Status premium ${!currentPremium ? 'ativado' : 'desativado'} com sucesso.`,
      });

      loadUsers();
    } catch (error) {
      console.error('Error updating premium status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status premium.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || user.tipo === filterType;
    return matchesSearch && matchesFilter;
  });

  const getUserTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'prestador':
        return <Wrench className="h-4 w-4 text-orange-600" />;
      case 'cliente':
        return <User className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUserTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'prestador':
        return 'bg-orange-100 text-orange-800';
      case 'cliente':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
              onClick={() => navigate('/admin')}
              className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && 'Voltar'}
            </Button>
            <div className="flex-1">
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                Gerenciar Usuários
              </h1>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                Administrar contas de usuários e configurações
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtros e Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterType('all')}
                    size="sm"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterType === 'cliente' ? 'default' : 'outline'}
                    onClick={() => setFilterType('cliente')}
                    size="sm"
                  >
                    Clientes
                  </Button>
                  <Button
                    variant={filterType === 'prestador' ? 'default' : 'outline'}
                    onClick={() => setFilterType('prestador')}
                    size="sm"
                  >
                    Prestadores
                  </Button>
                  <Button
                    variant={filterType === 'admin' ? 'default' : 'outline'}
                    onClick={() => setFilterType('admin')}
                    size="sm"
                  >
                    Admins
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando usuários...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getUserTypeIcon(user.tipo)}
                          <h3 className="font-medium">{user.nome}</h3>
                          <Badge className={getUserTypeColor(user.tipo)}>
                            {user.tipo}
                          </Badge>
                          {user.premium && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Crown className="h-3 w-3 mr-1" />
                              PRO
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                        {user.endereco_cidade && (
                          <p className="text-sm text-gray-500">📍 {user.endereco_cidade}</p>
                        )}
                        {user.descricao_servico && (
                          <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-100 rounded">
                            {user.descricao_servico.length > 100 
                              ? `${user.descricao_servico.substring(0, 100)}...`
                              : user.descricao_servico
                            }
                          </p>
                        )}
                        {user.nota_media && user.nota_media > 0 && (
                          <p className="text-sm text-yellow-600 mt-1">
                            ⭐ {user.nota_media.toFixed(1)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <UserRoleManager
                          userId={user.id}
                          currentRole={user.tipo}
                          userName={user.nome}
                          onRoleUpdate={loadUsers}
                        />
                        <Button
                          variant={user.premium ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTogglePremium(user.id, user.premium)}
                          className={user.premium ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                        >
                          <Crown className="h-3 w-3 mr-1" />
                          {user.premium ? 'PRO' : 'Ativar PRO'}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum usuário encontrado com os filtros aplicados.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
