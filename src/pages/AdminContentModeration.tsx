
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Flag, User, Ban, CheckCircle } from 'lucide-react';

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
      // For now, we'll use mock data
      // When the user_reports table is created, we can load from there
      console.log('Loading reports...');
      setReports([]);
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
      // For now, we'll just update local state
      // When the user_reports table is created, we can update there
      console.log('Updating report status:', reportId, status);

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
      // For now, we'll just log the ban
      // When the user_bans table is created, we can save there
      console.log('Banning user:', userId, 'for', duration, 'days');

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

        <Card>
          <CardContent className="p-8 text-center">
            <Flag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Nenhum relatório</h3>
            <p className="text-gray-600">
              Não há relatórios de usuários no momento.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminContentModeration;
