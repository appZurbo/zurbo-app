
import React from 'react';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RLSValidator } from '@/components/security/RLSValidator';
import { RealtimeTester } from '@/components/testing/RealtimeTester';
import { EnhancedFakeDataGenerator } from '@/components/testing/EnhancedFakeDataGenerator';
import { SystemToggleControls } from '@/components/testing/SystemToggleControls';
import { useAuth } from '@/hooks/useAuth';
import { TestTube, Shield, Users, MessageCircle, Database, Settings } from 'lucide-react';

const TestingDashboard = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <UnifiedLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600">
                Apenas administradores podem acessar esta página.
              </p>
            </CardContent>
          </Card>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Testes & Sistema</h1>
            <p className="text-gray-600">
              Ferramentas para validação de segurança, performance, dados de teste e controle do sistema
            </p>
          </div>

          <Tabs defaultValue="controls" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="controls" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Controles
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Segurança RLS
              </TabsTrigger>
              <TabsTrigger value="realtime" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Teste Realtime
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Dados de Teste
              </TabsTrigger>
              <TabsTrigger value="enhanced-data" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Dados Completos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="mt-6">
              <div className="flex justify-center">
                <SystemToggleControls />
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <div className="flex justify-center">
                <RLSValidator />
              </div>
            </TabsContent>

            <TabsContent value="realtime" className="mt-6">
              <div className="flex justify-center">
                <RealtimeTester />
              </div>
            </TabsContent>

            <TabsContent value="data" className="mt-6">
              <div className="flex justify-center">
                <FakeUserGenerator />
              </div>
            </TabsContent>

            <TabsContent value="enhanced-data" className="mt-6">
              <div className="flex justify-center">
                <EnhancedFakeDataGenerator />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default TestingDashboard;
