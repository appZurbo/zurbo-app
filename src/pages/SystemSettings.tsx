
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Shield, Database } from 'lucide-react';

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

const SystemSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { profile, isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      loadSettings();
    }
  }, [isAdmin]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error: any) {
      console.error('Error loading settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          value, 
          updated_by: profile.id,
          updated_at: new Date().toISOString() 
        })
        .eq('key', key);

      if (error) throw error;

      setSettings(prev =>
        prev.map(setting =>
          setting.key === key ? { ...setting, value } : setting
        )
      );

      toast({
        title: "Configuração atualizada",
        description: `${key} foi atualizado com sucesso`,
      });
    } catch (error: any) {
      console.error('Error updating setting:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getSetting = (key: string) => {
    return settings.find(s => s.key === key)?.value || '';
  };

  const getSettingDescription = (key: string) => {
    return settings.find(s => s.key === key)?.description || '';
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
          <p>Carregando configurações do sistema...</p>
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
            Gerencie as configurações globais da plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Modo de Manutenção</Label>
                <p className="text-sm text-gray-600">
                  {getSettingDescription('maintenance_mode')}
                </p>
                <Switch
                  checked={getSetting('maintenance_mode') === 'true'}
                  onCheckedChange={(checked) => 
                    updateSetting('maintenance_mode', checked.toString())
                  }
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label>Permitir Novos Registros</Label>
                <p className="text-sm text-gray-600">
                  {getSettingDescription('registration_enabled')}
                </p>
                <Switch
                  checked={getSetting('registration_enabled') === 'true'}
                  onCheckedChange={(checked) => 
                    updateSetting('registration_enabled', checked.toString())
                  }
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-gray-600">
                  {getSettingDescription('email_notifications')}
                </p>
                <Switch
                  checked={getSetting('email_notifications') === 'true'}
                  onCheckedChange={(checked) => 
                    updateSetting('email_notifications', checked.toString())
                  }
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limites e Restrições</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max_file_size">Tamanho Máximo de Arquivo (bytes)</Label>
                <p className="text-sm text-gray-600">
                  {getSettingDescription('max_file_size')}
                </p>
                <Input
                  id="max_file_size"
                  type="number"
                  value={getSetting('max_file_size')}
                  onChange={(e) => updateSetting('max_file_size', e.target.value)}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Todas as Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Chave</th>
                    <th className="text-left p-2">Valor</th>
                    <th className="text-left p-2">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.map((setting) => (
                    <tr key={setting.id} className="border-b">
                      <td className="p-2 font-mono text-sm">{setting.key}</td>
                      <td className="p-2">{setting.value}</td>
                      <td className="p-2 text-sm text-gray-600">{setting.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettings;
