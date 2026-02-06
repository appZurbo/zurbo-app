import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Wrench, MessageCircle, Image, ImageIcon, LayoutDashboard, Shield, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sub-components (Tabs)
import { AnalyticsTab } from '@/components/admin/tabs/AnalyticsTab';
import { ModeracaoTab } from '@/components/admin/tabs/ModeracaoTab';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("analytics");

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

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
    <div className="min-h-screen bg-gray-50/50">
      <UnifiedHeader />
      <div className={`mx-auto max-w-7xl ${isMobile ? 'px-4 py-4' : 'p-6'}`}>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && 'Voltar'}
            </Button>
            <div>
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                Painel Admin
              </h1>
              <p className="text-gray-600 text-sm">
                Gestão completa da plataforma Zurbo
              </p>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="analytics" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 h-auto p-1 bg-white border shadow-sm rounded-lg">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 py-2.5">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Visão Geral</span>
              <span className="sm:hidden">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="moderacao" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 py-2.5">
              <Shield className="h-4 w-4 mr-2" />
              Moderação
            </TabsTrigger>
            <TabsTrigger value="gerenciamento" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 py-2.5">
              <List className="h-4 w-4 mr-2" />
              Gestão
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="outline-none">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="moderacao" className="outline-none">
            <ModeracaoTab />
          </TabsContent>

          <TabsContent value="gerenciamento" className="outline-none space-y-6">
            {/* Extended Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/users')}>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Usuários</h3>
                    <p className="text-sm text-gray-500">Gerenciar clientes e prestadores</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/prestadores')}>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Prestadores</h3>
                    <p className="text-sm text-gray-500">Verificação e serviços</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/conversas')}>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Conversas</h3>
                    <p className="text-sm text-gray-500">Monitorar chat em tempo real</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/image-manager')}>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Imagens</h3>
                    <p className="text-sm text-gray-500">Gestão de banners e assets</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Ferramentas avançadas de configuração.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => navigate('/admin/banner-image-manager')}>
                    Gerenciar Banners 3D
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
