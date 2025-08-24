
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Shield, Bell, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/toast-system";

export const SystemToggleControls = () => {
  const [settings, setSettings] = useState({
    testing_mode: false,
    limits_enabled: true,
    periodic_notifications: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['testing_mode', 'limits_enabled', 'periodic_notifications']);

      if (error) throw error;

      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value === 'true';
        return acc;
      }, {} as Record<string, boolean>);

      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key: string, value: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key,
          value: value.toString(),
          description: getSettingDescription(key)
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      
      toast({
        title: "Configuração Atualizada",
        description: `${getSettingLabel(key)} ${value ? 'ativado' : 'desativado'}`,
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a configuração",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSettingLabel = (key: string) => {
    const labels = {
      testing_mode: 'Modo de Testes',
      limits_enabled: 'Limites de Uso',
      periodic_notifications: 'Notificações Periódicas'
    };
    return labels[key as keyof typeof labels] || key;
  };

  const getSettingDescription = (key: string) => {
    const descriptions = {
      testing_mode: 'Ativar modo de testes global',
      limits_enabled: 'Ativar limites de uso e bloqueios',
      periodic_notifications: 'Ativar notificações periódicas de teste'
    };
    return descriptions[key as keyof typeof descriptions] || '';
  };

  const getSettingIcon = (key: string) => {
    const icons = {
      testing_mode: <Database className="h-4 w-4" />,
      limits_enabled: <Shield className="h-4 w-4" />,
      periodic_notifications: <Bell className="h-4 w-4" />
    };
    return icons[key as keyof typeof icons] || <Settings className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Controles do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getSettingIcon(key)}
              <div>
                <Label htmlFor={key} className="font-medium">
                  {getSettingLabel(key)}
                </Label>
                <p className="text-sm text-gray-500">
                  {getSettingDescription(key)}
                </p>
              </div>
            </div>
            <Switch
              id={key}
              checked={value}
              onCheckedChange={(checked) => updateSetting(key, checked)}
              disabled={loading}
            />
          </div>
        ))}

        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-2">
            <Settings className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Atenção</p>
              <p className="text-yellow-700">
                Estas configurações afetam todo o sistema. Use com cuidado em produção.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
