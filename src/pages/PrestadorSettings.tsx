import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useMobile } from '@/hooks/useMobile';
import { useToast } from '@/hooks/use-toast';

const PrestadorSettings = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading, updateProfile } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    bio: '',
    descricao_servico: '', // Add this field
    endereco_cidade: '',
    endereco_bairro: '',
    endereco_rua: '',
    endereco_numero: '',
    endereco_cep: '',
    cpf: '',
    foto_url: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      // Prepare updates
      const updates = {
        ...formData,
        id: profile.id, // Ensure ID is included
      };
      
      // Attempt to update profile
      const updatedProfile = await updateProfile(profile.id, updates);
      
      if (updatedProfile) {
        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso!",
        });
        navigate('/prestador-dashboard');
      } else {
        throw new Error('Não foi possível atualizar o perfil.');
      }
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
        descricao_servico: profile.descricao_servico || '', // Add this
        endereco_cidade: profile.endereco_cidade || '',
        endereco_bairro: profile.endereco_bairro || '',
        endereco_rua: profile.endereco_rua || '',
        endereco_numero: profile.endereco_numero || '',
        endereco_cep: profile.endereco_cep || '',
        cpf: profile.cpf || '',
        foto_url: profile.foto_url || ''
      });
    }
  }, [profile]);

  if (authLoading) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando configurações...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <UnifiedHeader />
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
      </div>
    );
  }

  return (
    <div>
      <UnifiedHeader />
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/prestador-dashboard')}
              className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && 'Voltar'}
            </Button>
            
            <div className="flex-1">
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                Configurações do Prestador
              </h1>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                Atualize suas informações de perfil e configurações
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
                <div>
                  <Label htmlFor="foto_url">URL da Foto</Label>
                  <Input
                    id="foto_url"
                    name="foto_url"
                    type="url"
                    value={formData.foto_url}
                    onChange={handleInputChange}
                    placeholder="URL da sua foto de perfil"
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
