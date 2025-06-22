
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Mail, MessageCircle, Star } from 'lucide-react';

interface NotificationPreferences {
  email_new_client: boolean;
  email_new_message: boolean;
  email_new_review: boolean;
  push_new_client: boolean;
  push_new_message: boolean;
  push_new_review: boolean;
}

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_new_client: true,
    email_new_message: true,
    email_new_review: true,
    push_new_client: true,
    push_new_message: true,
    push_new_review: true,
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  useEffect(() => {
    loadPreferences();
  }, [profile]);

  const loadPreferences = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', profile.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const savePreferences = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: profile.id,
          ...preferences,
        });

      if (error) throw error;

      toast({
        title: "Preferências salvas!",
        description: "Suas configurações de notificação foram atualizadas.",
      });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configurações de Notificações
          </CardTitle>
          <p className="text-sm text-gray-600">
            Escolha como e quando você quer receber notificações
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium">Notificações por Email</h3>
            </div>
            
            <div className="space-y-3 pl-7">
              <div className="flex items-center justify-between">
                <Label htmlFor="email_new_client" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Novos clientes interessados
                </Label>
                <Switch
                  id="email_new_client"
                  checked={preferences.email_new_client}
                  onCheckedChange={(value) => updatePreference('email_new_client', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email_new_message" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Novas mensagens
                </Label>
                <Switch
                  id="email_new_message"
                  checked={preferences.email_new_message}
                  onCheckedChange={(value) => updatePreference('email_new_message', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email_new_review" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Novas avaliações
                </Label>
                <Switch
                  id="email_new_review"
                  checked={preferences.email_new_review}
                  onCheckedChange={(value) => updatePreference('email_new_review', value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium">Notificações Push</h3>
            </div>
            
            <div className="space-y-3 pl-7">
              <div className="flex items-center justify-between">
                <Label htmlFor="push_new_client" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Novos clientes interessados
                </Label>
                <Switch
                  id="push_new_client"
                  checked={preferences.push_new_client}
                  onCheckedChange={(value) => updatePreference('push_new_client', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="push_new_message" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Novas mensagens
                </Label>
                <Switch
                  id="push_new_message"
                  checked={preferences.push_new_message}
                  onCheckedChange={(value) => updatePreference('push_new_message', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="push_new_review" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Novas avaliações
                </Label>
                <Switch
                  id="push_new_review"
                  checked={preferences.push_new_review}
                  onCheckedChange={(value) => updatePreference('push_new_review', value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={savePreferences} 
              disabled={saving}
              className="w-full"
            >
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
