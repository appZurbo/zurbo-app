
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Flag, MessageCircle, Star, User, Ban, CheckCircle } from 'lucide-react';
import { ExportControls } from '@/components/admin/ExportControls';

interface Report {
  id: string;
  reported_user_id: string;
  reporter_id: string;
  type: 'inappropriate_content' | 'spam' | 'harassment' | 'fake_profile';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  reported_user?: {
    nome: string;
    email: string;
    tipo: string;
  };
  reporter?: {
    nome: string;
  };
}

const AdminContentModeration = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports');
  const { toast } = useToast();
  const { profile, isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      loadReports();
    }
  }, [isAdmin]);

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select(`
          *,
          reported_user:users!user_reports_reported_user_id_fkey (nome, email, tipo),
          reporter:users!user_reports_reporter_id_fkey (nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error loading reports:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os relatórios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: 'reviewed' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('user_reports')
        .update({ status })
        .eq('id', reportId);

      if (error) throw error;

      setReports(prev =>
        prev.map(report =>
          report.id === reportId ? { ...report, status } : report
        )
      );

      toast({
        title: "Status atualizado",
        description: `Relatório marcado como ${status === 'reviewed' ? 'revisado' : 'resolvido'}`,
      });
    } catch (error: any) {
      console.error('Error updating report status:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const banUser = async (userId: string, duration: number) => {
    try {
      const banUntil = new Date();
      banUntil.setDate(banUntil.getDate() + duration);

      const { error } = await supabase
        .from('user_bans')
        .insert({
          user_id: userId,
          banned_by: profile?.id,
          ban_until: banUntil.toISOString(),
          reason: 'Violação das regras da comunidade',
        });

      if (error) throw error;

      toast({
        title: "Usuário banido",
        description: `Usuário banido por ${duration} dias`,
      });
    } catch (error: any) {
      console.error('Error banning user:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
            <p className="text-gray-600">
              Você não tem permissão para acessar esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <p>Carregando dados de moderação...</p>
        </div>
      </div>
    );
  }

  const getReportTypeLabel = (type: string) => {
    const types = {
      inappropriate_content: 'Conteúdo Inapropriado',
      spam: 'Spam',
      harassment: 'Assédio',
      fake_profile: 'Perfil Falso',
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'destructive',
      reviewed: 'default',
      resolved: 'secondary',
    };
    
    const labels = {
      pending: 'Pendente',
      reviewed: 'Revisado',
      resolved: 'Resolvido',
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-orange-500" />
            Moderação de Conteúdo
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie relatórios de usuários e mantenha a comunidade segura
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Relatórios ({reports.filter(r => r.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              Exportar Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <div className="grid gap-4">
              {reports.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Flag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum relatório</h3>
                    <p className="text-gray-600">
                      Não há relatórios de usuários no momento.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                reports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {getReportTypeLabel(report.type)}
                        </CardTitle>
                        {getStatusBadge(report.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-1">
                              Usuário Reportado
                            </h4>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span>{report.reported_user?.nome}</span>
                              <Badge variant="outline">
                                {report.reported_user?.tipo}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-1">
                              Reportado por
                            </h4>
                            <span className="text-gray-600">
                              {report.reporter?.nome}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">
                            Descrição
                          </h4>
                          <p className="text-gray-600">{report.description}</p>
                        </div>
                        
                        {report.status === 'pending' && (
                          <div className="flex gap-2 pt-4 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateReportStatus(report.id, 'reviewed')}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marcar como Revisado
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => banUser(report.reported_user_id, 7)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Banir 7 dias
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => banUser(report.reported_user_id, 30)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Banir 30 dias
                            </Button>
                            
                            <Button
                              size="sm"
                              onClick={() => updateReportStatus(report.id, 'resolved')}
                            >
                              Resolver
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="export">
            <ExportControls 
              data={reports} 
              filename="relatorios-moderacao"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminContentModeration;
