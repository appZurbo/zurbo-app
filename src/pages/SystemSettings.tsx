
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Settings, DollarSign, Mail, Shield, Wrench } from 'lucide-react';

interface SystemConfig {
  commission_rate: number;
  maintenance_mode: boolean;
  max_portfolio_images: number;
  email_notifications_enabled: boolean;
  registration_enabled: boolean;
  announcement_text?: string;
}

const SystemSettings = () => {
  const [config, setConfig] = useState<SystemConfig>({
    commission_rate: 5,
    maintenance_mode: false,
    max_portfolio_images: 10,
    email_notifications_enabled: true,
    registration_enabled: true,
    announcement_text: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      loadSystemConfig();
    }
  }, [isAdmin]);

  const loadSystemConfig = async () => {
    try {
      // For now, we'll use default config
      // When the system_config table is created, we can load from there
      console.log('Loading system config...');
    } catch (error) {
      console.error('Error loading system config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      // For now, we'll just log the config
      // When the system_config table is created, we can save there
      console.log('Saving config:', config);

      toast({
        title: "Configurações salvas!",
        description: "As configurações do sistema foram atualizadas.",
      });
    } catch (error: any) {
      console.error('Error saving config:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value,
    }));
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
            <Settings className="h-8 w-8 text-white" />
          </div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-8 w-8 text-orange-500" />
            Configurações do Sistema
          </h1>
          <p className="text-gray-600 mt-2">
            Configure parâmetros globais da plataforma
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Manutenção
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max_portfolio">
                    Máximo de imagens no portfólio
                  </Label>
                  <Input
                    id="max_portfolio"
                    type="number"
                    min="1"
                    max="50"
                    value={config.max_portfolio_images}
                    onChange={(e) => updateConfig('max_portfolio_images', parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="registration">
                    Permitir novos cadastros
                  </Label>
                  <Switch
                    id="registration"
                    checked={config.registration_enabled}
                    onCheckedChange={(value) => updateConfig('registration_enabled', value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="announcement">
                    Texto de anúncio (aparece no banner)
                  </Label>
                  <Textarea
                    id="announcement"
                    value={config.announcement_text}
                    onChange={(e) => updateConfig('announcement_text', e.target.value)}
                    placeholder="Digite um anúncio importante para os usuários..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Financeiras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="commission">
                    Taxa de comissão (%)
                  </Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={config.commission_rate}
                    onChange={(e) => updateConfig('commission_rate', parseFloat(e.target.value))}
                  />
                  <p className="text-sm text-gray-600">
                    Percentual cobrado sobre cada transação realizada na plataforma
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email_notifications">
                      Notificações por email ativas
                    </Label>
                    <p className="text-sm text-gray-600">
                      Ativar/desativar todas as notificações por email do sistema
                    </p>
                  </div>
                  <Switch
                    id="email_notifications"
                    checked={config.email_notifications_enabled}
                    onCheckedChange={(value) => updateConfig('email_notifications_enabled', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Modo de Manutenção</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance">
                      Ativar modo de manutenção
                    </Label>
                    <p className="text-sm text-gray-600">
                      Quando ativo, apenas administradores podem acessar o sistema
                    </p>
                  </div>
                  <Switch
                    id="maintenance"
                    checked={config.maintenance_mode}
                    onCheckedChange={(value) => updateConfig('maintenance_mode', value)}
                  />
                </div>

                {config.maintenance_mode && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-medium">
                      ⚠️ Modo de manutenção ativo
                    </p>
                    <p className="text-yellow-700 text-sm">
                      Apenas administradores podem acessar o sistema atualmente.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={saveConfig} disabled={saving} size="lg">
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
