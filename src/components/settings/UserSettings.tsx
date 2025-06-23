
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Shield, Bell, MapPin, User, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LocationSettings } from '@/components/location/LocationSettings';
import { useMobile } from '@/hooks/useMobile';

export const UserSettings = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
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

  const handleDeleteAccount = async () => {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso."
      });

      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Erro ao excluir conta",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${isMobile ? 'px-0' : 'max-w-4xl mx-auto'}`}>
      <Card className={`${isMobile ? 'border-0 shadow-none bg-transparent' : ''}`}>
        <CardHeader className={`${isMobile ? 'px-0 pb-4' : ''}`}>
          <CardTitle className={`${isMobile ? 'text-lg' : ''}`}>
            Configurações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? 'px-0 py-0' : ''}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`grid grid-cols-4 w-full ${isMobile ? 'h-12 mb-6' : ''}`}>
              <TabsTrigger 
                value="profile" 
                className={`flex items-center gap-1 ${isMobile ? 'text-xs px-2' : 'gap-2'}`}
              >
                <User className="h-4 w-4" />
                <span className={`${isMobile ? 'hidden sm:inline' : ''}`}>Perfil</span>
              </TabsTrigger>
              <TabsTrigger 
                value="location" 
                className={`flex items-center gap-1 ${isMobile ? 'text-xs px-2' : 'gap-2'}`}
              >
                <MapPin className="h-4 w-4" />
                <span className={`${isMobile ? 'hidden sm:inline' : ''}`}>Local</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className={`flex items-center gap-1 ${isMobile ? 'text-xs px-2' : 'gap-2'}`}
              >
                <Bell className="h-4 w-4" />
                <span className={`${isMobile ? 'hidden sm:inline' : ''}`}>Notif</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className={`flex items-center gap-1 ${isMobile ? 'text-xs px-2' : 'gap-2'}`}
              >
                <Shield className="h-4 w-4" />
                <span className={`${isMobile ? 'hidden sm:inline' : ''}`}>Segur</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className={`${isMobile ? 'shadow-sm' : ''}`}>
                <CardHeader>
                  <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>
                    Informações do Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    <div>
                      <Label className="font-medium">Nome</Label>
                      <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">{profile?.nome}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Email</Label>
                      <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">{profile?.email}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Tipo de Conta</Label>
                      <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded capitalize">{profile?.tipo}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Membro desde</Label>
                      <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                        {profile?.criado_em ? new Date(profile.criado_em).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">
                      Para editar informações do perfil
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/perfil'}
                      className={`${isMobile ? 'w-full' : ''}`}
                    >
                      Editar Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="mt-6">
              <LocationSettings />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
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
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card className={`${isMobile ? 'shadow-sm' : ''}`}>
                <CardHeader>
                  <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>
                    Segurança da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Alterar Senha</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Para alterar sua senha, clique no botão abaixo. Você receberá um email com instruções.
                    </p>
                    <Button variant="outline" className={`${isMobile ? 'w-full' : ''}`}>
                      Solicitar Alteração de Senha
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-4 text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Zona de Perigo
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      As ações abaixo são irreversíveis. Tenha cuidado ao prosseguir.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount} 
                      disabled={loading} 
                      className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      {loading ? 'Excluindo...' : 'Excluir Conta'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
