
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Shield, 
  AlertTriangle, 
  MessageCircle, 
  Image, 
  Ban, 
  Check,
  Clock,
  Flag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useMobile } from '@/hooks/useMobile';
import { useToast } from '@/hooks/use-toast';

const Moderacao = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();

  // Mock data para demonstração
  const [reports] = useState([
    {
      id: '1',
      type: 'message',
      content: 'Conteúdo inadequado reportado por usuário',
      reporter: 'Cliente Maria',
      reported: 'Prestador João',
      status: 'pending',
      createdAt: new Date('2024-01-15'),
      category: 'Linguagem inadequada'
    },
    {
      id: '2',
      type: 'profile',
      content: 'Perfil com informações falsas',
      reporter: 'Cliente Ana',
      reported: 'Prestador Pedro',
      status: 'resolved',
      createdAt: new Date('2024-01-14'),
      category: 'Informações falsas'
    },
    {
      id: '3',
      type: 'service',
      content: 'Serviço não foi realizado conforme acordado',
      reporter: 'Cliente Carlos',
      reported: 'Prestador José',
      status: 'pending',
      createdAt: new Date('2024-01-13'),
      category: 'Qualidade do serviço'
    }
  ]);

  const handleApproveReport = (reportId: string) => {
    toast({
      title: "Denúncia aprovada",
      description: "Ação disciplinar será tomada contra o usuário reportado."
    });
  };

  const handleRejectReport = (reportId: string) => {
    toast({
      title: "Denúncia rejeitada",
      description: "A denúncia foi considerada improcedente."
    });
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status === 'resolved');

  const ReportCard = ({ report }: { report: any }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={report.status === 'pending' ? 'destructive' : 'default'}>
                {report.status === 'pending' ? 'Pendente' : 'Resolvido'}
              </Badge>
              <Badge variant="outline">
                {report.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                {report.type === 'message' && <MessageCircle className="h-4 w-4" />}
                {report.type === 'profile' && <Shield className="h-4 w-4" />}
                {report.type === 'service' && <Flag className="h-4 w-4" />}
                <span className="capitalize">{report.type}</span>
              </div>
            </div>
            
            <h3 className="font-semibold mb-2">{report.content}</h3>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Denunciante:</strong> {report.reporter}</p>
              <p><strong>Denunciado:</strong> {report.reported}</p>
              <p><strong>Data:</strong> {report.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
          
          {report.status === 'pending' && (
            <div className="flex flex-col gap-2 ml-4">
              <Button
                size="sm"
                variant="default"
                onClick={() => handleApproveReport(report.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRejectReport(report.id)}
              >
                <Ban className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
            </div>
          )}
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
                Moderação de Conteúdo
              </h1>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                Gerencie denúncias e conteúdo da plataforma
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{pendingReports.length}</p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{resolvedReports.length}</p>
                  <p className="text-sm text-gray-600">Resolvidos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {Math.round((resolvedReports.length / reports.length) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Taxa Resolução</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Pendentes ({pendingReports.length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Resolvidos ({resolvedReports.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="space-y-4">
                {pendingReports.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhuma denúncia pendente</p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingReports.map(report => (
                    <ReportCard key={report.id} report={report} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="resolved">
              <div className="space-y-4">
                {resolvedReports.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhuma denúncia resolvida</p>
                    </CardContent>
                  </Card>
                ) : (
                  resolvedReports.map(report => (
                    <ReportCard key={report.id} report={report} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Ferramentas de Moderação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <MessageCircle className="h-6 w-6" />
                  <span>Mensagens Reportadas</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <Image className="h-6 w-6" />
                  <span>Imagens Reportadas</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  <span>Usuários Suspeitos</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Moderacao;
