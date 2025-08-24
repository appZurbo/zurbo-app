
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, User, Mail, FileText, Camera, MessageSquare, Star, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { useProfilePicture } from '@/hooks/useProfilePicture';
import { CommentsList } from './CommentsList';
import { UserSettings } from '../settings/UserSettings';

export const ProfilePageFixed = () => {
  const { profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    endereco_cidade: '',
    bio: '',
  });
  const { uploadProfilePicture, uploading } = useProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        endereco_cidade: profile.endereco_cidade || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const validateFormData = () => {
    if (!formData.nome || formData.nome.trim().length < 2) {
      toast({
        title: "Erro de validação",
        description: "Nome deve ter pelo menos 2 caracteres.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const updateProfile = async () => {
    if (!profile || !validateFormData()) return;
    
    setLoading(true);
    try {
      const sanitizedData = {
        nome: formData.nome.trim(),
        endereco_cidade: formData.endereco_cidade.trim(),
        bio: formData.bio.trim(),
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

      // Recarregar a página para atualizar os dados
      setTimeout(() => window.location.reload(), 1000);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo e tamanho do arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter menos de 5MB.",
        variant: "destructive",
      });
      return;
    }

    const result = await uploadProfilePicture(file);
    if (result) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const maskCPF = (cpf: string) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.***.***-**');
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Perfil não encontrado</p>
          <Button onClick={() => window.location.href = '/'}>
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Avaliações</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Configurações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Meu Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Foto e informações básicas */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.foto_url} alt={profile.nome} />
                    <AvatarFallback className="text-xl">
                      {profile.nome?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full p-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-semibold">{profile.nome}</h3>
                  <p className="text-gray-600 capitalize">{profile.tipo}</p>
                  {uploading && (
                    <p className="text-sm text-orange-500 mt-1">
                      Enviando foto...
                    </p>
                  )}
                </div>
              </div>

              {/* Campos do perfil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  {editing ? (
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      maxLength={100}
                      className="mt-1"
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
                      value={formData.endereco_cidade}
                      onChange={(e) => setFormData({...formData, endereco_cidade: e.target.value})}
                      maxLength={200}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded">
                      {profile.endereco_cidade || 'Não informado'}
                    </p>
                  )}
                </div>
              </div>

              {/* Descrição para prestadores */}
              {profile.tipo === 'prestador' && (
                <div>
                  <Label htmlFor="bio">Descrição dos Serviços</Label>
                  {editing ? (
                    <Textarea
                      id="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Descreva seus serviços e experiência..."
                      maxLength={500}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded">
                      {profile.bio || 'Nenhuma descrição adicionada'}
                    </p>
                  )}
                </div>
              )}

              {/* Botões de ação */}
              <div className="flex gap-2 pt-4 border-t">
                {editing ? (
                  <>
                    <Button onClick={updateProfile} disabled={loading}>
                      {loading ? 'Salvando...' : 'Salvar Alterações'}
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
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Minhas Avaliações
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommentsList userId={profile.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <UserSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
