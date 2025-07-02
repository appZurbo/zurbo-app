import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useMobile } from '@/hooks/useMobile';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  User, 
  Briefcase, 
  MapPin, 
  Image, 
  Bell,
  Plus,
  X,
  Camera,
  Save
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PrestadorSettingsImproved = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading, updateLocalProfile } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  
  // Personal Info
  const [personalData, setPersonalData] = useState({
    nome: '',
    email: '',
    cpf: '',
    foto_url: '',
    bio: '',
    descricao_servico: ''
  });

  // Location Data
  const [locationData, setLocationData] = useState({
    endereco_cidade: '',
    endereco_bairro: '',
    endereco_rua: '',
    endereco_numero: '',
    endereco_cep: ''
  });

  // Services Data
  const [servicesData, setServicesData] = useState({
    servicos: [] as string[],
    preco_min: '',
    preco_max: '',
    disponibilidade: true
  });

  // Notification Preferences
  const [notificationData, setNotificationData] = useState({
    email_mensagens: true,
    email_novos_pedidos: true,
    email_avaliacoes: true,
    push_mensagens: true,
    push_novos_pedidos: true,
    push_avaliacoes: true
  });

  useEffect(() => {
    if (profile) {
      setPersonalData({
        nome: profile.nome || '',
        email: profile.email || '',
        cpf: profile.cpf || '',
        foto_url: profile.foto_url || '',
        bio: profile.bio || '',
        descricao_servico: profile.descricao_servico || ''
      });

      setLocationData({
        endereco_cidade: profile.endereco_cidade || '',
        endereco_bairro: profile.endereco_bairro || '',
        endereco_rua: profile.endereco_rua || '',
        endereco_numero: profile.endereco_numero || '',
        endereco_cep: profile.endereco_cep || ''
      });

      setServicesData({
        servicos: [],
        preco_min: '',
        preco_max: '',
        disponibilidade: profile.em_servico || true
      });
    }
  }, [profile]);

  const handlePersonalSubmit = async () => {
    setSaving(true);
    try {
      if (!profile) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('users')
        .update({
          ...personalData,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) throw error;

      updateLocalProfile(personalData);
      toast({
        title: "Sucesso",
        description: "Informações pessoais atualizadas!"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLocationSubmit = async () => {
    setSaving(true);
    try {
      if (!profile) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('users')
        .update({
          ...locationData,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) throw error;

      updateLocalProfile(locationData);
      toast({
        title: "Sucesso",
        description: "Localização atualizada!"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar a localização.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

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

  if (!profile || profile.tipo !== 'prestador') {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Apenas prestadores podem acessar esta página.
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
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-5xl mx-auto p-6'}`}>
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
                Gerencie suas informações e preferências
              </p>
            </div>
          </div>

          {/* Tabbed Settings */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {!isMobile && 'Pessoal'}
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {!isMobile && 'Serviços'}
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {!isMobile && 'Localização'}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {!isMobile && 'Notificações'}
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        value={personalData.nome}
                        onChange={(e) => setPersonalData(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalData.email}
                        onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={personalData.cpf}
                        onChange={(e) => setPersonalData(prev => ({ ...prev, cpf: e.target.value }))}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="foto_url">URL da Foto de Perfil</Label>
                      <Input
                        id="foto_url"
                        type="url"
                        value={personalData.foto_url}
                        onChange={(e) => setPersonalData(prev => ({ ...prev, foto_url: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Biografia Profissional</Label>
                    <Textarea
                      id="bio"
                      value={personalData.bio}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Conte sobre sua experiência, especialidades e diferencial..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="descricao_servico">Descrição dos Serviços</Label>
                    <Textarea
                      id="descricao_servico"
                      value={personalData.descricao_servico}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, descricao_servico: e.target.value }))}
                      placeholder="Breve descrição que aparecerá nos cards de prestadores..."
                      rows={3}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Esta descrição será exibida nos resultados de busca e no seu perfil.
                    </p>
                  </div>

                  <Button 
                    onClick={handlePersonalSubmit} 
                    disabled={saving}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Salvando...' : 'Salvar Informações Pessoais'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-green-500" />
                    Serviços Oferecidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Status de Disponibilidade</h3>
                      <p className="text-sm text-gray-600">
                        Quando ativo, você aparece nos resultados de busca
                      </p>
                    </div>
                    <Switch
                      checked={servicesData.disponibilidade}
                      onCheckedChange={(checked) => 
                        setServicesData(prev => ({ ...prev, disponibilidade: checked }))
                      }
                    />
                  </div>

                  <div>
                    <Label>Categorias de Serviços</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {[
                        'Limpeza', 'Reparos', 'Elétrica', 'Beleza', 
                        'Marido de Aluguel', 'Jardinagem', 'Automotivo', 
                        'Doméstico', 'Tecnologia', 'Cuidados'
                      ].map((service) => (
                        <div
                          key={service}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                            servicesData.servicos.includes(service)
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                          onClick={() => {
                            const newServices = servicesData.servicos.includes(service)
                              ? servicesData.servicos.filter(s => s !== service)
                              : [...servicesData.servicos, service];
                            setServicesData(prev => ({ ...prev, servicos: newServices }));
                          }}
                        >
                          <span className="text-sm font-medium">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preco_min">Preço Mínimo (R$)</Label>
                      <Input
                        id="preco_min"
                        type="number"
                        value={servicesData.preco_min}
                        onChange={(e) => setServicesData(prev => ({ ...prev, preco_min: e.target.value }))}
                        placeholder="50.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="preco_max">Preço Máximo (R$)</Label>
                      <Input
                        id="preco_max"
                        type="number"
                        value={servicesData.preco_max}
                        onChange={(e) => setServicesData(prev => ({ ...prev, preco_max: e.target.value }))}
                        placeholder="500.00"
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Configurações de Serviços
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-500" />
                    Localização de Atendimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="endereco_cidade">Cidade</Label>
                      <Input
                        id="endereco_cidade"
                        value={locationData.endereco_cidade}
                        onChange={(e) => setLocationData(prev => ({ ...prev, endereco_cidade: e.target.value }))}
                        placeholder="Sua cidade"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endereco_bairro">Bairro</Label>
                      <Input
                        id="endereco_bairro"
                        value={locationData.endereco_bairro}
                        onChange={(e) => setLocationData(prev => ({ ...prev, endereco_bairro: e.target.value }))}
                        placeholder="Seu bairro"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="endereco_rua">Rua</Label>
                      <Input
                        id="endereco_rua"
                        value={locationData.endereco_rua}
                        onChange={(e) => setLocationData(prev => ({ ...prev, endereco_rua: e.target.value }))}
                        placeholder="Nome da rua"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endereco_numero">Número</Label>
                      <Input
                        id="endereco_numero"
                        value={locationData.endereco_numero}
                        onChange={(e) => setLocationData(prev => ({ ...prev, endereco_numero: e.target.value }))}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="endereco_cep">CEP</Label>
                    <Input
                      id="endereco_cep"
                      value={locationData.endereco_cep}
                      onChange={(e) => setLocationData(prev => ({ ...prev, endereco_cep: e.target.value }))}
                      placeholder="00000-000"
                      className="max-w-xs"
                    />
                  </div>

                  <Button 
                    onClick={handleLocationSubmit}
                    disabled={saving}
                    className="w-full bg-purple-500 hover:bg-purple-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Salvando...' : 'Salvar Localização'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-500" />
                    Preferências de Notificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Notificações por Email</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Novas Mensagens</p>
                          <p className="text-sm text-gray-600">Receba emails quando clientes enviarem mensagens</p>
                        </div>
                        <Switch
                          checked={notificationData.email_mensagens}
                          onCheckedChange={(checked) => 
                            setNotificationData(prev => ({ ...prev, email_mensagens: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Novos Pedidos</p>
                          <p className="text-sm text-gray-600">Receba emails sobre novos pedidos de serviço</p>
                        </div>
                        <Switch
                          checked={notificationData.email_novos_pedidos}
                          onCheckedChange={(checked) => 
                            setNotificationData(prev => ({ ...prev, email_novos_pedidos: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Novas Avaliações</p>
                          <p className="text-sm text-gray-600">Receba emails quando receber avaliações</p>
                        </div>
                        <Switch
                          checked={notificationData.email_avaliacoes}
                          onCheckedChange={(checked) => 
                            setNotificationData(prev => ({ ...prev, email_avaliacoes: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Preferências
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PrestadorSettingsImproved;