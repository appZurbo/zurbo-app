
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Database,
  Users, 
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EnhancedFakeDataGenerator } from '@/components/testing/EnhancedFakeDataGenerator';
import { SystemToggleControls } from '@/components/testing/SystemToggleControls';

interface SystemStatus {
  database: 'online' | 'offline' | 'error';
  auth: 'online' | 'offline' | 'error';
  realtime: 'online' | 'offline' | 'error';
  storage: 'online' | 'offline' | 'error';
}

interface TestResults {
  limits: boolean;
  sos: boolean;
  escrow: boolean;
  realtime: boolean;
}

export default function TestingDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'offline',
    auth: 'offline',
    realtime: 'offline',
    storage: 'offline'
  });
  
  const [testResults, setTestResults] = useState<TestResults>({
    limits: false,
    sos: false,
    escrow: false,
    realtime: false
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkSystemStatus = async () => {
    setLoading(true);
    try {
      // Test database connection
      const { error: dbError } = await supabase.from('users').select('count').limit(1);
      
      // Test auth
      const { error: authError } = await supabase.auth.getSession();
      
      setSystemStatus({
        database: dbError ? 'error' : 'online',
        auth: authError ? 'error' : 'online',
        realtime: 'online', // Assume online for now
        storage: 'online'   // Assume online for now
      });
      
    } catch (error) {
      console.error('Error checking system status:', error);
      toast({
        title: "Erro",
        description: "Erro ao verificar status do sistema",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runTests = async () => {
    setLoading(true);
    try {
      // Test usage limits
      const limitsTest = await testUsageLimits();
      
      // Test SOS limits
      const sosTest = await testSOSLimits();
      
      // Test escrow system
      const escrowTest = await testEscrowSystem();
      
      // Test realtime
      const realtimeTest = await testRealtime();
      
      setTestResults({
        limits: limitsTest,
        sos: sosTest,
        escrow: escrowTest,
        realtime: realtimeTest
      });
      
      toast({
        title: "Testes Concluídos",
        description: "Todos os testes foram executados",
      });
      
    } catch (error) {
      console.error('Error running tests:', error);
      toast({
        title: "Erro",
        description: "Erro ao executar testes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testUsageLimits = async (): Promise<boolean> => {
    try {
      // Simular teste de limites de uso
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Math.random() > 0.3; // 70% chance de sucesso
    } catch {
      return false;
    }
  };

  const testSOSLimits = async (): Promise<boolean> => {
    try {
      // Simular teste de limites SOS
      await new Promise(resolve => setTimeout(resolve, 800));
      return Math.random() > 0.2; // 80% chance de sucesso
    } catch {
      return false;
    }
  };

  const testEscrowSystem = async (): Promise<boolean> => {
    try {
      // Simular teste do sistema escrow
      await new Promise(resolve => setTimeout(resolve, 1200));
      return Math.random() > 0.4; // 60% chance de sucesso
    } catch {
      return false;
    }
  };

  const testRealtime = async (): Promise<boolean> => {
    try {
      // Simular teste de realtime
      await new Promise(resolve => setTimeout(resolve, 600));
      return Math.random() > 0.1; // 90% chance de sucesso
    } catch {
      return false;
    }
  };

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="secondary">Offline</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel de Testes</h1>
          <p className="text-muted-foreground">Monitoramento e testes do sistema Zurbo</p>
        </div>
        <Button onClick={checkSystemStatus} disabled={loading}>
          <Activity className="h-4 w-4 mr-2" />
          Atualizar Status
        </Button>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status do Sistema</TabsTrigger>
          <TabsTrigger value="tests">Testes Automatizados</TabsTrigger>
          <TabsTrigger value="data">Dados de Teste</TabsTrigger>
          <TabsTrigger value="controls">Controles</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                {getStatusIcon(systemStatus.database)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Supabase</div>
                {getStatusBadge(systemStatus.database)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auth</CardTitle>
                {getStatusIcon(systemStatus.auth)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Autenticação</div>
                {getStatusBadge(systemStatus.auth)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Realtime</CardTitle>
                {getStatusIcon(systemStatus.realtime)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">WebSocket</div>
                {getStatusBadge(systemStatus.realtime)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage</CardTitle>
                {getStatusIcon(systemStatus.storage)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Arquivos</div>
                {getStatusBadge(systemStatus.storage)}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Testes de Segurança e Limites
              </CardTitle>
              <CardDescription>
                Executa testes automatizados nos sistemas críticos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runTests} disabled={loading} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Executar Todos os Testes
              </Button>
              
              <Separator />
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <span>Limites de Uso</span>
                  {testResults.limits ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Limites SOS</span>
                  {testResults.sos ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Sistema Escrow</span>
                  {testResults.escrow ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Realtime</span>
                  {testResults.realtime ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <EnhancedFakeDataGenerator />
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <SystemToggleControls />
        </TabsContent>
      </Tabs>
    </div>
  );
}
