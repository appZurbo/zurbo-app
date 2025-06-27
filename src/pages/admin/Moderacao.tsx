
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  ArrowLeft,
  Eye,
  Ban,
  CheckCircle,
  X,
  Flag,
  Settings,
  Database,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useMobile } from '@/hooks/useMobile';

const AdminModeracao = () => {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();
  const isMobile = useMobile();
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    setReports([
      {
        id: 1,
        type: 'usuario',
        reportedUser: 'João Silva',
        reportedBy: 'Maria Santos',
        reason: 'Comportamento inadequado',
        description: 'Usuário enviou mensagens ofensivas durante negociação de serviço',
        status: 'pendente',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        type: 'conteudo',
        reportedUser: 'Pedro Oliveira',
        reportedBy: 'Ana Costa',
        reason: 'Conteúdo inapropriado',
        description: 'Perfil contém informações falsas sobre qualificações',
        status: 'pendente',
        createdAt: '2024-01-14T15:20:00Z'
      }
    ]);

    setUsers([
      {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com',
        type: 'cliente',
        status: 'ativo',
        reportCount: 2,
        joinDate: '2023-06-15'
      },
      {
        id: 2,
        name: 'Pedro Oliveira',
        email: 'pedro@email.com',
        type: 'prestador',
        status: 'ativo',
        reportCount: 1,
        joinDate: '2023-08-20'
      }
    ]);
  }, []);

  if (!isAdmin) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Esta área é exclusiva para administradores do sistema.
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                Voltar à Página Inicial
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleReportAction = (reportId: number, action: 'approve' | 'reject') => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: action === 'approve' ? 'aprovado' : 'rejeitado' }
        : report
    ));
  };

  const handleUserAction = (userId: number, action: 'ban' | 'unban') => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: action === 'ban' ? 'banido' : 'ativo' }
        : user
    ));
  };

  return (
    <div>
      <UnifiedHeader />
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-7xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/relatorios')}
              className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && 'Voltar'}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                    Painel de Moderação
                  </h1>
                  <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                    Gerenciar denúncias e usuários do sistema
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Denúncias Pendentes</p>
                    <p className="text-2xl font-bold">{reports.filter(r => r.status === 'pendente').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Usuários Ativos</p>
                    <p className="text-2xl font-bold">{users.filter(u => u.status === 'ativo').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Ban className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Usuários Banidos</p>
                    <p className="text-2xl font-bold">{users.filter(u => u.status === 'banido').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Resolvidas Hoje</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="reports" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports">Denúncias</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="system">Sistema</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5 text-red-500" />
                    Denúncias Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.filter(r => r.status === 'pendente').map((report) => (
                      <div key={report.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={report.type === 'usuario' ? 'destructive' : 'secondary'}>
                                {report.type === 'usuario' ? 'Usuário' : 'Conteúdo'}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <h4 className="font-semibold">Denúncia contra: {report.reportedUser}</h4>
                            <p className="text-sm text-gray-600">Por: {report.reportedBy}</p>
                            <p className="text-sm text-gray-600">Motivo: {report.reason}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-4 bg-gray-50 p-3 rounded">
                          {report.description}
                        </p>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReportAction(report.id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprovar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReportAction(report.id, 'reject')}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Rejeitar
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Gerenciamento de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{user.name}</h4>
                              <Badge variant={user.type === 'prestador' ? 'default' : 'secondary'}>
                                {user.type === 'prestador' ? 'Prestador' : 'Cliente'}
                              </Badge>
                              <Badge variant={user.status === 'ativo' ? 'default' : 'destructive'}>
                                {user.status === 'ativo' ? 'Ativo' : 'Banido'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-600">
                              {user.reportCount} denúncias • Membro desde {new Date(user.joinDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            {user.status === 'ativo' ? (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleUserAction(user.id, 'ban')}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Banir
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'unban')}
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Desbanir
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Perfil
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-purple-500" />
                      Configurações do Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Acesse configurações avançadas do sistema, parâmetros globais e ajustes de segurança.
                    </p>
                    <Button onClick={() => navigate('/admin/sistema')} className="w-full">
                      Abrir Configurações
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-500" />
                      Dados de Teste
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Criar dados de teste para desenvolvimento e demonstração do sistema.
                    </p>
                    <Button variant="outline" className="w-full">
                      Criar Dados de Teste
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminModeracao;
