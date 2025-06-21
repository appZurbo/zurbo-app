
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Settings, Bell, Trash2, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const UserSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Senha alterada!",
        description: "Sua senha foi alterada com sucesso",
      });

      setShowPasswordDialog(false);
      setNewPassword('');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETAR CONTA') {
      toast({
        title: "Confirmação incorreta",
        description: "Digite 'DELETAR CONTA' para confirmar",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Deletar perfil do usuário
      if (profile?.id) {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', profile.id);

        if (error) throw error;
      }

      // Fazer logout
      await supabase.auth.signOut();
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída permanentemente",
      });
      
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notificações */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="notifications">Notificações</Label>
                <p className="text-sm text-gray-600">
                  Receber notificações sobre novos serviços e mensagens
                </p>
              </div>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          {/* Alterar Senha */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-gray-500" />
                <div>
                  <Label>Alterar Senha</Label>
                  <p className="text-sm text-gray-600">
                    Atualize sua senha de acesso
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordDialog(true)}
              >
                Alterar
              </Button>
            </div>
          </div>

          {/* Excluir Conta */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-red-500" />
                <div>
                  <Label className="text-red-600">Excluir Conta</Label>
                  <p className="text-sm text-gray-600">
                    Esta ação é permanente e irreversível
                  </p>
                </div>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteDialog(true)}
              >
                Excluir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para alterar senha */}
      <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterar Senha</AlertDialogTitle>
            <AlertDialogDescription>
              Digite sua nova senha abaixo:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Nova senha (mín. 6 caracteres)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePasswordChange}
              disabled={loading || newPassword.length < 6}
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para excluir conta */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              ⚠️ Excluir Conta Permanentemente
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Esta ação é IRREVERSÍVEL e irá:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Excluir permanentemente seu perfil</li>
                <li>Remover todos os seus dados</li>
                <li>Apagar seu histórico de avaliações</li>
                <li>Deletar todas as suas informações do sistema</li>
              </ul>
              <p className="text-red-600 font-medium">
                Para confirmar, digite "DELETAR CONTA" abaixo:
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Digite: DELETAR CONTA"
              className="border-red-300 focus:border-red-500"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={loading || deleteConfirmation !== 'DELETAR CONTA'}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
