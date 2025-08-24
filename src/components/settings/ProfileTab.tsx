
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, Mail, MapPin, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/hooks/toast-system";
import { useProfilePicture } from '@/hooks/useProfilePicture';
import { BecomeProviderButton } from '@/components/migration/BecomeProviderButton';
import { supabase } from '@/integrations/supabase/client';

export const ProfileTab = () => {
  const { profile, updateLocalProfile } = useAuth();
  
  const { uploadProfilePicture, uploading } = useProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: profile?.nome || '',
    endereco_cidade: profile?.endereco_cidade || '',
    endereco_rua: profile?.endereco_rua || '',
    endereco_numero: profile?.endereco_numero || '',
    endereco_bairro: profile?.endereco_bairro || '',
    endereco_cep: profile?.endereco_cep || '',
    bio: profile?.bio || ''
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter menos de 5MB.",
        variant: "destructive",
      });
      return;
    }

    await uploadProfilePicture(file);
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          nome: formData.nome.trim(),
          endereco_cidade: formData.endereco_cidade.trim(),
          endereco_rua: formData.endereco_rua.trim(),
          endereco_numero: formData.endereco_numero.trim(),
          endereco_bairro: formData.endereco_bairro.trim(),
          endereco_cep: formData.endereco_cep.trim(),
          bio: formData.bio.trim(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      updateLocalProfile(formData);
      setIsEditing(false);
      
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
      setIsSaving(false);
    }
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return 'Não informado';
    // Format CPF as XXX.XXX.XXX-XX
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  if (!profile) {
    return <div className="text-center py-4">Carregando perfil...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.foto_url} alt={profile.nome} />
            <AvatarFallback className="text-xl bg-orange-100 text-orange-600">
              {profile.nome?.charAt(0)?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 rounded-full p-2 bg-white shadow-md"
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
        {uploading && (
          <p className="text-sm text-orange-500">Enviando foto...</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo</Label>
          {isEditing ? (
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              placeholder="Seu nome completo"
            />
          ) : (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span>{profile.nome}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{profile.email}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF (Cadastrado na criação da conta)</Label>
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded border">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-mono text-gray-700">
              {formatCPF(profile.cpf)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            CPF registrado no momento da criação da conta (não modificável)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          {isEditing ? (
            <Input
              id="cidade"
              value={formData.endereco_cidade}
              onChange={(e) => setFormData({...formData, endereco_cidade: e.target.value})}
              placeholder="Sua cidade"
            />
          ) : (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{profile.endereco_cidade || 'Não informado'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bairro">Bairro</Label>
          {isEditing ? (
            <Input
              id="bairro"
              value={formData.endereco_bairro}
              onChange={(e) => setFormData({...formData, endereco_bairro: e.target.value})}
              placeholder="Seu bairro"
            />
          ) : (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="text-sm">{profile.endereco_bairro || 'Não informado'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rua">Rua</Label>
          {isEditing ? (
            <Input
              id="rua"
              value={formData.endereco_rua}
              onChange={(e) => setFormData({...formData, endereco_rua: e.target.value})}
              placeholder="Nome da rua"
            />
          ) : (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="text-sm">{profile.endereco_rua || 'Não informado'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero">Número</Label>
          {isEditing ? (
            <Input
              id="numero"
              value={formData.endereco_numero}
              onChange={(e) => setFormData({...formData, endereco_numero: e.target.value})}
              placeholder="Número da casa/apt"
            />
          ) : (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="text-sm">{profile.endereco_numero || 'Não informado'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cep">CEP</Label>
          {isEditing ? (
            <Input
              id="cep"
              value={formData.endereco_cep}
              onChange={(e) => setFormData({...formData, endereco_cep: e.target.value})}
              placeholder="00000-000"
            />
          ) : (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="text-sm">{profile.endereco_cep || 'Não informado'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bio Section for Providers */}
      {(profile.tipo === 'prestador' || isEditing) && (
        <div className="space-y-2">
          <Label htmlFor="bio">Descrição dos Serviços</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Descreva seus serviços e experiência..."
              maxLength={500}
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded">
              <span className="text-sm">{profile.bio || 'Nenhuma descrição adicionada'}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        {isEditing ? (
          <>
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
              Cancelar
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="flex-1">
            Editar Perfil
          </Button>
        )}
      </div>

      {/* Become Provider Button - Only for clients */}
      <div className="pt-4 border-t">
        <BecomeProviderButton />
      </div>
    </div>
  );
};
