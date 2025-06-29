
import React from 'react';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RLSValidator } from '@/components/security/RLSValidator';
import { FakeUserGenerator } from '@/components/testing/FakeUserGenerator';
import { RealtimeTester } from '@/components/testing/RealtimeTester';
import { useAuth } from '@/hooks/useAuth';
import { TestTube, Shield, Users, MessageCircle } from 'lucide-react';

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Testes</h1>
            <p className="text-gray-600">
              Ferramentas para validação de segurança, performance e dados de teste
            </p>
          </div>

          <Tabs defaultValue="security" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
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
            </TabsList>

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
          </Tabs>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default TestingDashboard;
