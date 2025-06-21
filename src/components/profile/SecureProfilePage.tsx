
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MapPin, User, Mail, FileText, Camera, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { validateCPF, sanitizeText, formatCPF } from '@/utils/validation';
import { useSecureLocation } from '@/hooks/useSecureLocation';
import LocationConsentDialog from '@/components/auth/LocationConsentDialog';

const SecureProfilePage = () => {
  const { profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    descricao: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const { toast } = useToast();
  const { latitude, longitude, requestLocation } = useSecureLocation();

  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        endereco: profile.endereco || '',
        descricao: profile.descricao || '',
        latitude: profile.latitude || null,
        longitude: profile.longitude || null,
      });
    }
  }, [profile]);

  const validateFormData = () => {
    if (!formData.nome || sanitizeText(formData.nome).length < 2) {
      toast({
        title: "Erro de validação",
        description: "Nome deve ter pelo menos 2 caracteres válidos.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleLocationConsent = (granted: boolean) => {
    setShowLocationDialog(false);
    if (granted) {
      requestLocation(() => {
        setFormData(prev => ({
          ...prev,
          latitude: latitude,
          longitude: longitude
        }));
      });
    }
  };

  const updateProfile = async () => {
    if (!profile || !validateFormData()) return;
    
    setLoading(true);
    try {
      const sanitizedData = {
        nome: sanitizeText(formData.nome),
        endereco: sanitizeText(formData.endereco),
        descricao: sanitizeText(formData.descricao),
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      const { error } = await supabase
        .from('users')
        .update(sanitizedData)
        .eq('id', profile.id);

      if (error) throw error;

      setEditing(false);
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (deleteConfirmationText !== 'DELETAR CONTA') {
      toast({
        title: "Confirmação incorreta",
        description: "Digite 'DELETAR CONTA' para confirmar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      // Delete user profile (cascade will handle related data)
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('auth_id', user.id);

      if (error) throw error;

      await supabase.auth.signOut();
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída permanentemente.",
      });
      
      window.location.reload();
    } catch (error: any) {
      console.error('Account deletion error:', error);
      toast({
        title: "Erro ao excluir conta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
      setDeleteConfirmationText('');
    }
  };

  const maskCPF = (cpf: string) => {
    if (!cpf) return '';
    return formatCPF(cpf).replace(/\d(?=\d{4})/g, '*');
  };

  if (authLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center p-8">Perfil não encontrado</div>;
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Meu Perfil
              <Shield className="h-4 w-4 text-green-600 ml-auto" title="Perfil Seguro" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.foto_perfil} />
                <AvatarFallback>{profile.nome?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{profile.nome}</h3>
                <p className="text-gray-600 capitalize">{profile.tipo}</p>
                <Button variant="outline" size="sm" className="mt-2" disabled>
                  <Camera className="h-4 w-4 mr-2" />
                  Alterar Foto
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                {editing ? (
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    maxLength={100}
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">{profile.nome}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{profile.email}</span>
                  <Shield className="h-4 w-4 text-green-600 ml-auto" title="Email Verificado" />
                </div>
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded">
                  <span>{maskCPF(profile.cpf)}</span>
                  <Shield className="h-4 w-4 text-green-600 ml-auto" title="CPF Validado" />
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                {editing ? (
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    maxLength={200}
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">{profile.endereco || 'Não informado'}</p>
                )}
              </div>
            </div>

            {editing && (
              <div>
                <Label>Localização</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLocationDialog(true)}
                    className="flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Atualizar GPS
                  </Button>
                  {(formData.latitude && formData.longitude) && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Localização atualizada
                    </span>
                  )}
                </div>
              </div>
            )}

            {profile.tipo === 'prestador' && (
              <div>
                <Label htmlFor="descricao">Descrição dos Serviços</Label>
                {editing ? (
                  <textarea
                    id="descricao"
                    className="w-full mt-1 p-2 border rounded"
                    rows={3}
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descreva seus serviços e experiência..."
                    maxLength={500}
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">
                    {profile.descricao || 'Nenhuma descrição adicionada'}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button onClick={updateProfile} disabled={loading}>
                    Salvar Alterações
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              )}
            </div>

            {/* Secure Account Deletion */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5" />
                Zona de Perigo
              </h3>
              <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Excluir Conta Permanentemente
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">
                      ⚠️ Excluir Conta Permanentemente
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                      <p className="font-semibold">Esta ação é IRREVERSÍVEL e irá:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Excluir permanentemente seu perfil</li>
                        <li>Remover todos os seus serviços</li>
                        <li>Apagar seu histórico de pagamentos</li>
                        <li>Deletar todos os seus dados do sistema</li>
                      </ul>
                      <p className="text-red-600 font-medium">
                        Para confirmar, digite "DELETAR CONTA" abaixo:
                      </p>
                      <Input
                        value={deleteConfirmationText}
                        onChange={(e) => setDeleteConfirmationText(e.target.value)}
                        placeholder="Digite: DELETAR CONTA"
                        className="border-red-300 focus:border-red-500"
                      />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleAccountDeletion}
                      disabled={loading || deleteConfirmationText !== 'DELETAR CONTA'}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>

      <LocationConsentDialog
        open={showLocationDialog}
        onConsent={handleLocationConsent}
      />
    </>
  );
};

export default SecureProfilePage;
