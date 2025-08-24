
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, User, Mail, FileText, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types';

// Using centralized UserProfile type from @/types

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single();

      if (error) throw error;
      
      // Ensure tipo is properly typed
      const profileData: UserProfile = {
        ...data,
        tipo: data.tipo as 'cliente' | 'prestador' | 'admin' | 'moderator'
      };
      
      setProfile(profileData);
      setFormData(profileData);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...formData });
      setEditing(false);
      
      toast.success("Suas informações foram salvas com sucesso.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const maskCPF = (cpf: string) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.***.***-**');
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center p-8">Perfil não encontrado</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Meu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.foto_url} />
              <AvatarFallback>{profile.nome?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{profile.nome}</h3>
              <p className="text-gray-600 capitalize">{profile.tipo}</p>
              <Button variant="outline" size="sm" className="mt-2">
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
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
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
              </div>
            </div>

            <div>
              <Label htmlFor="cpf">CPF</Label>
              <p className="mt-1 p-2 bg-gray-50 rounded">{maskCPF(profile.cpf)}</p>
            </div>

            <div>
              <Label htmlFor="endereco_cidade">Cidade</Label>
              {editing ? (
                <Input
                  id="endereco_cidade"
                  value={formData.endereco_cidade || ''}
                  onChange={(e) => setFormData({...formData, endereco_cidade: e.target.value})}
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 rounded">{profile.endereco_cidade || 'Não informado'}</p>
              )}
            </div>
          </div>

          {profile.tipo === 'prestador' && (
            <div>
              <Label htmlFor="bio">Descrição dos Serviços</Label>
              {editing ? (
                <textarea
                  id="bio"
                  className="w-full mt-1 p-2 border rounded"
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Descreva seus serviços e experiência..."
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 rounded">
                  {profile.bio || 'Nenhuma descrição adicionada'}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
