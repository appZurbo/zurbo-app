import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Star, 
  Search, 
  Filter,
  Download,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { ExportControls } from '@/components/admin/ExportControls';
import { UserRoleManager } from '@/components/admin/UserRoleManager';
import { SimulationMode } from '@/components/admin/SimulationMode';

interface DashboardStats {
  totalUsers: number;
  totalPrestadores: number;
  totalClientes: number;
  totalAvaliacoes: number;
  notaMedia: number;
}

interface UserData {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  criado_em: string;
  nota_media: number;
  premium: boolean;
  endereco_cidade?: string;
}

export const AdminDashboard = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPrestadores: 0,
    totalClientes: 0,
    totalAvaliacoes: 0,
    notaMedia: 0
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [simulationMode, setSimulationMode] = useState({
    isActive: false,
    role: 'cliente'
  });

  useEffect(() => {
    if (profile?.tipo === 'admin' || profile?.tipo === 'moderator') {
      loadDashboardData();
    }
  }, [profile]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Carregar estatísticas
      const { data: usersData } = await supabase
        .from('users')
        .select('tipo, nota_media');
      
      const { data: avaliacoesData } = await supabase
        .from('avaliacoes')
        .select('nota');

      if (usersData) {
        const totalUsers = usersData.length;
        const totalPrestadores = usersData.filter(u => u.tipo === 'prestador').length;
        const totalClientes = usersData.filter(u => u.tipo === 'cliente').length;
        const totalAvaliacoes = avaliacoesData?.length || 0;
        const notaMedia = avaliacoesData?.length 
          ? avaliacoesData.reduce((acc, av) => acc + (av.nota || 0), 0) / avaliacoesData.length
          : 0;

        setStats({
          totalUsers,
          totalPrestadores,
          totalClientes,
          totalAvaliacoes,
          notaMedia
        });
      }

      // Carregar lista de usuários
      const { data: usersListData } = await supabase
        .from('users')
        .select('id, nome, email, tipo, criado_em, nota_media, premium, endereco_cidade')
        .order('criado_em', { ascending: false });

      if (usersListData) {
        setUsers(usersListData);
      }

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'todos' || user.tipo === filterType;
    return matchesSearch && matchesFilter;
  });

  const exportData = () => {
    const csvContent = [
      ['Nome', 'Email', 'Tipo', 'Cidade', 'Nota Média', 'Premium', 'Data Cadastro'],
      ...filteredUsers.map(user => [
        user.nome,
        user.email,
        user.tipo,
        user.endereco_cidade || '',
        user.nota_media?.toString() || '0',
        user.premium ? 'Sim' : 'Não',
        new Date(user.criado_em).toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'usuarios_zurbo.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSimulationChange = (isSimulating: boolean, simulatedRole?: string) => {
    setSimulationMode({
      isActive: isSimulating,
      role: simulatedRole || 'cliente'
    });
  };

  const handleUserRoleUpdate = () => {
    loadDashboardData(); // Recarregar dados após atualização
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center animate-pulse">
            <Shield className="text-white h-8 w-8" />
          </div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-orange-600" />
              Painel Administrativo - Zurbo
            </h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo, {profile?.nome} ({profile?.tipo})
            </p>
          </div>
          <div className="flex gap-3">
            <SimulationMode onSimulationChange={handleSimulationChange} />
            <Button onClick={loadDashboardData} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Modo Simulação Ativo */}
        {simulationMode.isActive && (
          <div className="mb-6">
            <SimulationMode onSimulationChange={handleSimulationChange} />
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Prestadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalPrestadores}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <UserX className="h-4 w-4" />
                Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalClientes}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.totalAvaliacoes}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Nota Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.notaMedia.toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles de Exportação */}
        <div className="mb-6">
          <ExportControls 
            data={filteredUsers} 
            filename="usuarios_zurbo" 
          />
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="todos">Todos os usuários</option>
                <option value="prestador">Prestadores</option>
                <option value="cliente">Clientes</option>
                <option value="admin">Administradores</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Lista de Usuários ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{user.nome}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.tipo === 'admin' ? 'destructive' :
                          user.tipo === 'prestador' ? 'default' : 'secondary'
                        }>
                          {user.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.endereco_cidade || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {user.nota_media?.toFixed(1) || '0.0'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.premium && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Premium
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.criado_em).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <UserRoleManager
                          userId={user.id}
                          currentRole={user.tipo}
                          userName={user.nome}
                          onRoleUpdate={handleUserRoleUpdate}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum usuário encontrado com os filtros aplicados.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
