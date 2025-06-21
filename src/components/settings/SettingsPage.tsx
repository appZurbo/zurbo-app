
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Settings, LogOut, Trash2, MapPin, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SettingsPageProps {
  onLogout: () => void;
}

const SettingsPage = ({ onLogout }: SettingsPageProps) => {
  const [locationPreference, setLocationPreference] = useState('gps');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      onLogout();
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Primeiro, obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      // Deletar o perfil do usuário (isso acionará o cascade delete)
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('auth_id', user.id);

      if (error) throw error;

      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída permanentemente.",
      });
      
      onLogout();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir conta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        (await supabase.auth.getUser()).data.user?.email || ''
      );

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preferências de Localização */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              <MapPin className="h-4 w-4 inline mr-2" />
              Preferência de Localização
            </Label>
            <RadioGroup value={locationPreference} onValueChange={setLocationPreference}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gps" id="gps" />
                <Label htmlFor="gps">Usar GPS automaticamente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="endereco" id="endereco" />
                <Label htmlFor="endereco">Usar endereço fixo do perfil</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-600 mt-2">
              Você pode alterar isso a qualquer momento
            </p>
          </div>

          {/* Alterar Senha */}
          <div className="border-t pt-6">
            <Button
              variant="outline"
              onClick={handleChangePassword}
              className="w-full justify-start"
            >
              <Key className="h-4 w-4 mr-2" />
              Alterar Senha
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Enviaremos um email com instruções para redefinir sua senha
            </p>
          </div>

          {/* Logout */}
          <div className="border-t pt-6">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair da Conta
            </Button>
          </div>

          {/* Excluir Conta */}
          <div className="border-t pt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente sua
                    conta e removerá todos os seus dados de nossos servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {loading ? 'Excluindo...' : 'Sim, excluir conta'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-red-600 mt-2">
              ⚠️ Esta ação é irreversível e todos os seus dados serão perdidos
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
