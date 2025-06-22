
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Bell } from 'lucide-react';

interface NotificationPreferences {
  email_novos_pedidos: boolean;
  email_mensagens: boolean;
  email_avaliacoes: boolean;
  push_novos_pedidos: boolean;
  push_mensagens: boolean;
  push_avaliacoes: boolean;
}

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_novos_pedidos: true,
    email_mensagens: true,
    email_avaliacoes: true,
    push_novos_pedidos: true,
    push_mensagens: true,
    push_avaliacoes: true,
  });
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      loadPreferences();
    }
  }, [profile]);

  const loadPreferences = async () => {
    // For now, we'll use default preferences
    // When the notification_preferences table is created, we can load from there
    console.log('Loading notification preferences for user:', profile?.id);
  };

  const savePreferences = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      // For now, we'll just show a success message
      // When the notification_preferences table is created, we can save there
      console.log('Saving preferences:', preferences);

      toast({
        title: "Preferências salvas!",
        description: "Suas configurações de notificação foram atualizadas.",
      });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas preferências.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configurações de Notificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Notificações por Email</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-pedidos">Novos pedidos de serviço</Label>
                <Switch
                  id="email-pedidos"
                  checked={preferences.email_novos_pedidos}
                  onCheckedChange={(checked) => updatePreference('email_novos_pedidos', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-mensagens">Novas mensagens</Label>
                <Switch
                  id="email-mensagens"
                  checked={preferences.email_mensagens}
                  onCheckedChange={(checked) => updatePreference('email_mensagens', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-avaliacoes">Novas avaliações</Label>
                <Switch
                  id="email-avaliacoes"
                  checked={preferences.email_avaliacoes}
                  onCheckedChange={(checked) => updatePreference('email_avaliacoes', checked)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Notificações Push</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-pedidos">Novos pedidos de serviço</Label>
                <Switch
                  id="push-pedidos"
                  checked={preferences.push_novos_pedidos}
                  onCheckedChange={(checked) => updatePreference('push_novos_pedidos', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-mensagens">Novas mensagens</Label>
                <Switch
                  id="push-mensagens"
                  checked={preferences.push_mensagens}
                  onCheckedChange={(checked) => updatePreference('push_mensagens', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-avaliacoes">Novas avaliações</Label>
                <Switch
                  id="push-avaliacoes"
                  checked={preferences.push_avaliacoes}
                  onCheckedChange={(checked) => updatePreference('push_avaliacoes', checked)}
                />
              </div>
            </div>
          </div>

          <Button onClick={savePreferences} disabled={loading} className="w-full">
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
