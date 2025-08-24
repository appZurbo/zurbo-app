
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/hooks/toast-system";
import { supabase } from '@/integrations/supabase/client';
import { useMobile } from '@/hooks/useMobile';

export const NotificationTab = () => {
  const { profile } = useAuth();
  
  const isMobile = useMobile();
  const [notificationSettings, setNotificationSettings] = useState({
    email_novos_pedidos: true,
    email_mensagens: true,
    email_avaliacoes: true,
    push_novos_pedidos: true,
    push_mensagens: true,
    push_avaliacoes: true
  });

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: profile.id,
          [key]: value
        });

      if (error) throw error;

      setNotificationSettings(prev => ({
        ...prev,
        [key]: value
      }));

      toast({
        title: "Configuração atualizada",
        description: "Suas preferências de notificação foram salvas."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`${isMobile ? 'shadow-sm' : ''}`}>
      <CardHeader>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>
          Preferências de Notificação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">Notificações por Email</h4>
          <div className="space-y-4">
            <div className={`flex justify-between ${isMobile ? 'flex-col gap-2' : 'items-center'}`}>
              <div className="flex-1">
                <Label className="font-medium">Novos pedidos de serviço</Label>
                <p className="text-sm text-gray-500">Receber email quando alguém solicitar seus serviços</p>
              </div>
              <Switch 
                checked={notificationSettings.email_novos_pedidos} 
                onCheckedChange={(checked) => handleNotificationUpdate('email_novos_pedidos', checked)} 
              />
            </div>
            
            <div className={`flex justify-between ${isMobile ? 'flex-col gap-2' : 'items-center'}`}>
              <div className="flex-1">
                <Label className="font-medium">Mensagens</Label>
                <p className="text-sm text-gray-500">Receber email para novas mensagens</p>
              </div>
              <Switch 
                checked={notificationSettings.email_mensagens} 
                onCheckedChange={(checked) => handleNotificationUpdate('email_mensagens', checked)} 
              />
            </div>
            
            <div className={`flex justify-between ${isMobile ? 'flex-col gap-2' : 'items-center'}`}>
              <div className="flex-1">
                <Label className="font-medium">Avaliações</Label>
                <p className="text-sm text-gray-500">Receber email quando receber uma avaliação</p>
              </div>
              <Switch 
                checked={notificationSettings.email_avaliacoes} 
                onCheckedChange={(checked) => handleNotificationUpdate('email_avaliacoes', checked)} 
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-4">Notificações Push</h4>
          <div className="space-y-4">
            <div className={`flex justify-between ${isMobile ? 'flex-col gap-2' : 'items-center'}`}>
              <div className="flex-1">
                <Label className="font-medium">Novos pedidos de serviço</Label>
                <p className="text-sm text-gray-500">Receber notificações no navegador</p>
              </div>
              <Switch 
                checked={notificationSettings.push_novos_pedidos} 
                onCheckedChange={(checked) => handleNotificationUpdate('push_novos_pedidos', checked)} 
              />
            </div>
            
            <div className={`flex justify-between ${isMobile ? 'flex-col gap-2' : 'items-center'}`}>
              <div className="flex-1">
                <Label className="font-medium">Mensagens</Label>
                <p className="text-sm text-gray-500">Receber notificações para novas mensagens</p>
              </div>
              <Switch 
                checked={notificationSettings.push_mensagens} 
                onCheckedChange={(checked) => handleNotificationUpdate('push_mensagens', checked)} 
              />
            </div>
            
            <div className={`flex justify-between ${isMobile ? 'flex-col gap-2' : 'items-center'}`}>
              <div className="flex-1">
                <Label className="font-medium">Avaliações</Label>
                <p className="text-sm text-gray-500">Receber notificações para avaliações</p>
              </div>
              <Switch 
                checked={notificationSettings.push_avaliacoes} 
                onCheckedChange={(checked) => handleNotificationUpdate('push_avaliacoes', checked)} 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
