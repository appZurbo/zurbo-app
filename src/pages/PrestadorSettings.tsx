import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMobile } from '@/hooks/useMobile';
import { useToast } from '@/hooks/use-toast';
import { useProfilePicture } from '@/hooks/useProfilePicture';
import { ArrowLeft, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PrestadorSettings = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading, updateLocalProfile, user } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();
  const { uploadProfilePicture, uploading } = useProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    bio: '',
    descricao_servico: '',
    endereco_cidade: '',
    endereco_bairro: '',
    endereco_rua: '',
    endereco_numero: '',
    endereco_cep: '',
    cpf: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

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

    console.log('Starting upload process...');
    const result = await uploadProfilePicture(file);
    
    if (result) {
      console.log('Upload successful, URL:', result);
      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso!",
      });
    }

    // Limpar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!profile) throw new Error('Usuário não autenticado');
      
      // Validate required fields
      if (!formData.nome || !formData.email) {
        toast({
          title: "Erro",
          description: "Nome e email são obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      // Update profile in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          nome: formData.nome,
          email: formData.email,
          bio: formData.bio,
          descricao_servico: formData.descricao_servico,
          endereco_cidade: formData.endereco_cidade,
          endereco_bairro: formData.endereco_bairro,
          endereco_rua: formData.endereco_rua,
          endereco_numero: formData.endereco_numero,
          endereco_cep: formData.endereco_cep,
          cpf: formData.cpf,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) throw error;

      // Update local profile
      updateLocalProfile(formData);
      
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
      navigate('/prestador-dashboard');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        email: profile.email || '',
        bio: profile.bio || '',
        descricao_servico: profile.descricao_servico || '',
        endereco_cidade: profile.endereco_cidade || '',
        endereco_bairro: profile.endereco_bairro || '',
        endereco_rua: profile.endereco_rua || '',
        endereco_numero: profile.endereco_numero || '',
        endereco_cep: profile.endereco_cep || '',
        cpf: profile.cpf || ''
      });
    }
  }, [profile]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado como prestador para acessar esta página.
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
          <div className="flex-1 mb-6">
            <h1 className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
              Configurações do Prestador
            </h1>
            <p className={`text-gray-600 mb-8 ${isMobile ? 'text-sm' : ''}`}>
              Atualize suas informações de perfil e configurações
            </p>
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                  <AvatarFallback className="text-xl bg-orange-100 text-orange-600">
                    {profile?.nome?.charAt(0)?.toUpperCase() || 'P'}
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
                <p className="text-sm text-orange-500 mt-2">Enviando foto...</p>
              )}
              <p className="text-sm text-gray-600 mt-2 text-center">
                Clique no ícone da câmera para alterar sua foto de perfil
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Seu endereço de email"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="Seu CPF"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bio">Biografia Profissional</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Descreva sua experiência e especialidades..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="descricao_servico">Descrição do Serviço</Label>
                  <Textarea
                    id="descricao_servico"
                    name="descricao_servico"
                    value={formData.descricao_servico}
                    onChange={handleInputChange}
                    placeholder="Breve descrição dos seus serviços para exibir nos cards..."
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Esta descrição aparecerá nos cards de prestadores e no modal de contratação.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Address Section */}
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="endereco_cidade">Cidade</Label>
                  <Input
                    id="endereco_cidade"
                    name="endereco_cidade"
                    value={formData.endereco_cidade}
                    onChange={handleInputChange}
                    placeholder="Sua cidade"
                  />
                </div>
                <div>
                  <Label htmlFor="endereco_bairro">Bairro</Label>
                  <Input
                    id="endereco_bairro"
                    name="endereco_bairro"
                    value={formData.endereco_bairro}
                    onChange={handleInputChange}
                    placeholder="Seu bairro"
                  />
                </div>
                <div>
                  <Label htmlFor="endereco_rua">Rua</Label>
                  <Input
                    id="endereco_rua"
                    name="endereco_rua"
                    value={formData.endereco_rua}
                    onChange={handleInputChange}
                    placeholder="Sua rua"
                  />
                </div>
                <div>
                  <Label htmlFor="endereco_numero">Número</Label>
                  <Input
                    id="endereco_numero"
                    name="endereco_numero"
                    value={formData.endereco_numero}
                    onChange={handleInputChange}
                    placeholder="Número"
                  />
                </div>
                <div>
                  <Label htmlFor="endereco_cep">CEP</Label>
                  <Input
                    id="endereco_cep"
                    name="endereco_cep"
                    value={formData.endereco_cep}
                    onChange={handleInputChange}
                    placeholder="Seu CEP"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              Salvar Alterações
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrestadorSettings;
