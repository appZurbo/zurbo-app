import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Shield, Bell, MapPin, User, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LocationSettings } from '@/components/location/LocationSettings';
export const UserSettings = () => {
  const {
    profile
  } = useAuth();
  const {
    toast
  } = useToast();
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
      const {
        error
      } = await supabase.from('notification_preferences').upsert({
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
      const {
        error
      } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso."
      });

      // Redirecionar para página inicial
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
  return <div className="max-w-4xl mx-auto p-4 px-0 py-0">
      <Card className="px-0 mx-0 my-0 py-0">
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-[4px]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Localização</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Segurança</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome</Label>
                      <p className="text-sm text-gray-600 mt-1">{profile?.nome}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-gray-600 mt-1">{profile?.email}</p>
                    </div>
                    <div>
                      <Label>Tipo de Conta</Label>
                      <p className="text-sm text-gray-600 mt-1 capitalize">{profile?.tipo}</p>
                    </div>
                    <div>
                      <Label>Membro desde</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {profile?.criado_em ? new Date(profile.criado_em).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Para editar informações do perfil, acesse a página de perfil
                    </p>
                    <Button onClick={() => window.location.href = '/perfil'}>
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preferências de Notificação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Notificações por Email</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Novos pedidos de serviço</Label>
                          <p className="text-sm text-gray-500">Receber email quando alguém solicitar seus serviços</p>
                        </div>
                        <Switch checked={notificationSettings.email_novos_pedidos} onCheckedChange={checked => handleNotificationUpdate('email_novos_pedidos', checked)} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Mensagens</Label>
                          <p className="text-sm text-gray-500">Receber email para novas mensagens</p>
                        </div>
                        <Switch checked={notificationSettings.email_mensagens} onCheckedChange={checked => handleNotificationUpdate('email_mensagens', checked)} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Avaliações</Label>
                          <p className="text-sm text-gray-500">Receber email quando receber uma avaliação</p>
                        </div>
                        <Switch checked={notificationSettings.email_avaliacoes} onCheckedChange={checked => handleNotificationUpdate('email_avaliacoes', checked)} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-4">Notificações Push</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Novos pedidos de serviço</Label>
                          <p className="text-sm text-gray-500">Receber notificações no navegador</p>
                        </div>
                        <Switch checked={notificationSettings.push_novos_pedidos} onCheckedChange={checked => handleNotificationUpdate('push_novos_pedidos', checked)} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Mensagens</Label>
                          <p className="text-sm text-gray-500">Receber notificações para novas mensagens</p>
                        </div>
                        <Switch checked={notificationSettings.push_mensagens} onCheckedChange={checked => handleNotificationUpdate('push_mensagens', checked)} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Avaliações</Label>
                          <p className="text-sm text-gray-500">Receber notificações para avaliações</p>
                        </div>
                        <Switch checked={notificationSettings.push_avaliacoes} onCheckedChange={checked => handleNotificationUpdate('push_avaliacoes', checked)} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Segurança da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Alterar Senha</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Para alterar sua senha, clique no botão abaixo. Você receberá um email com instruções.
                    </p>
                    <Button variant="outline">
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
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading} className="flex items-center gap-2">
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
    </div>;
};