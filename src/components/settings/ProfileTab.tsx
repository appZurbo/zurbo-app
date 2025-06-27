
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/utils/database/users';
import { useProfilePicture } from '@/hooks/useProfilePicture';
import { useRef } from 'react';

export const ProfileTab = () => {
  const { profile, updateLocalProfile } = useAuth();
  const { toast } = useToast();
  const { uploadProfilePicture, uploading } = useProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    data_nascimento: '',
    endereco_cidade: '',
    endereco_rua: '',
    endereco_numero: '',
    endereco_bairro: '',
    endereco_cep: '',
    bio: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        email: profile.email || '',
        cpf: profile.cpf || generateFakeCPF(),
        data_nascimento: profile.data_nascimento || '',
        endereco_cidade: profile.endereco_cidade || '',
        endereco_rua: profile.endereco_rua || '',
        endereco_numero: profile.endereco_numero || '',
        endereco_bairro: profile.endereco_bairro || '',
        endereco_cep: profile.endereco_cep || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const generateFakeCPF = () => {
    const randomNum = Math.floor(Math.random() * 900000000) + 100000000;
    return `${randomNum.toString().slice(0, 3)}.${randomNum.toString().slice(3, 6)}.${randomNum.toString().slice(6, 9)}-${Math.floor(Math.random() * 90) + 10}`;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };

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

    if (!formData.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, preencha seu nome completo.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.cpf.trim()) {
      toast({
        title: "CPF obrigatório",
        description: "Por favor, preencha seu CPF.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const updatedProfile = await updateUserProfile(profile.id, {
        nome: formData.nome.trim(),
        cpf: formData.cpf.trim(),
        data_nascimento: formData.data_nascimento,
        endereco_cidade: formData.endereco_cidade.trim(),
        endereco_rua: formData.endereco_rua.trim(),
        endereco_numero: formData.endereco_numero.trim(),
        endereco_bairro: formData.endereco_bairro.trim(),
        endereco_cep: formData.endereco_cep.trim(),
        bio: formData.bio.trim()
      });

      if (updatedProfile) {
        updateLocalProfile(updatedProfile);
        setEditing(false);
        toast({
          title: "Perfil atualizado!",
          description: "Suas informações foram salvas com sucesso.",
        });
      } else {
        throw new Error('Falha ao atualizar perfil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        email: profile.email || '',
        cpf: profile.cpf || generateFakeCPF(),
        data_nascimento: profile.data_nascimento || '',
        endereco_cidade: profile.endereco_cidade || '',
        endereco_rua: profile.endereco_rua || '',
        endereco_numero: profile.endereco_numero || '',
        endereco_bairro: profile.endereco_bairro || '',
        endereco_cep: profile.endereco_cep || '',
        bio: profile.bio || ''
      });
    }
    setEditing(false);
  };

  if (!profile) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photo Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.foto_url} alt={profile.nome} />
              <AvatarFallback className="text-lg">
                {profile.nome?.charAt(0)?.toUpperCase() || '?'}
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
          <div>
            <h3 className="font-semibold">{profile.nome}</h3>
            <p className="text-sm text-gray-600 capitalize">{profile.tipo}</p>
            {uploading && (
              <p className="text-xs text-orange-500 mt-1">Enviando foto...</p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome">Nome Completo *</Label>
            {editing ? (
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="mt-1"
                required
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded">{profile.nome}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <p className="mt-1 p-2 bg-gray-50 rounded text-gray-600">{profile.email}</p>
          </div>

          <div>
            <Label htmlFor="cpf">CPF *</Label>
            {editing ? (
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
                maxLength={14}
                className="mt-1"
                required
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded">{formData.cpf}</p>
            )}
          </div>

          <div>
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            {editing ? (
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData(prev => ({ ...prev, data_nascimento: e.target.value }))}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded">
                {formData.data_nascimento ? new Date(formData.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado'}
              </p>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h4 className="font-medium">Endereço</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endereco_cidade">Cidade</Label>
              {editing ? (
                <Input
                  id="endereco_cidade"
                  value={formData.endereco_cidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco_cidade: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 rounded">{formData.endereco_cidade || 'Não informado'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="endereco_bairro">Bairro</Label>
              {editing ? (
                <Input
                  id="endereco_bairro"
                  value={formData.endereco_bairro}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco_bairro: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 rounded">{formData.endereco_bairro || 'Não informado'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="endereco_rua">Rua</Label>
              {editing ? (
                <Input
                  id="endereco_rua"
                  value={formData.endereco_rua}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco_rua: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 rounded">{formData.endereco_rua || 'Não informado'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="endereco_numero">Número</Label>
              {editing ? (
                <Input
                  id="endereco_numero"
                  value={formData.endereco_numero}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco_numero: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 rounded">{formData.endereco_numero || 'Não informado'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="endereco_cep">CEP</Label>
              {editing ? (
                <Input
                  id="endereco_cep"
                  value={formData.endereco_cep}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco_cep: e.target.value }))}
                  placeholder="00000-000"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 rounded">{formData.endereco_cep || 'Não informado'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bio for Providers */}
        {profile.tipo === 'prestador' && (
          <div>
            <Label htmlFor="bio">Descrição dos Serviços</Label>
            {editing ? (
              <Textarea
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Descreva seus serviços e experiência..."
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded">
                {formData.bio || 'Nenhuma descrição adicionada'}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          {editing ? (
            <>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              Editar Perfil
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
