import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, MapPin, 
  Camera, Briefcase, ChevronRight, ChevronLeft, 
  CheckCircle, Image as ImageIcon,
  ArrowRight, Plus, Trash2, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { updateUserProfile } from '@/utils/database/users';
import { getServicos, Servico } from '@/utils/database/servicos';
import { CIDADES_REGIAO } from '@/components/cidades/GerenciadorCidades';
import { useProfilePicture } from '@/hooks/useProfilePicture';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmailConfirmationModal } from '@/components/auth/EmailConfirmationModal';
import ProviderVerificationUpload, { VerificationFiles } from '@/components/auth/ProviderVerificationUpload';
import { cn } from '@/lib/utils';
import { markOnboardingCompleted } from '@/utils/onboarding';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const { uploadProfilePicture, uploading: uploadingPhoto } = useProfilePicture();
  
  const [role, setRole] = useState<'cliente' | 'prestador' | null>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cidade: '',
    bio: '',
    servicos: [] as string[],
    cidadesAtendidas: [] as string[],
    portfolio: [] as File[],
    verificacao: {} as VerificationFiles,
    notificacoes: true,
  });

  const [servicosDisponiveis, setServicosDisponiveis] = useState<Servico[]>([]);

  // Definição das etapas (removida etapa 'auth' pois dados vêm do formulário)
  const clientSteps = [
    { id: 'confirm', title: 'E-mail', optional: true },
    { id: 'profile', title: 'Perfil' },
    { id: 'address', title: 'Endereço', optional: true },
    { id: 'prefs', title: 'Ajustes', optional: true },
    { id: 'done', title: 'Pronto!' }
  ];

  const providerSteps = [
    { id: 'confirm', title: 'E-mail', optional: true },
    { id: 'profile', title: 'Perfil' },
    { id: 'services', title: 'Serviços' },
    { id: 'area', title: 'Atendimento' },
    { id: 'portfolio', title: 'Portfólio', optional: true },
    { id: 'verify', title: 'Verificação', optional: true },
    { id: 'address', title: 'Endereço', optional: true },
    { id: 'prefs', title: 'Ajustes', optional: true },
    { id: 'done', title: 'Dashboard' }
  ];

  const steps = role === 'prestador' ? providerSteps : clientSteps;
  const progress = ((step + 1) / steps.length) * 100;

  useEffect(() => {
    // Verificar se usuário está autenticado
    if (user) {
      // Detectar se veio do Google Auth
      const provider = user.app_metadata?.provider;
      setIsGoogleAuth(provider === 'google');
      
      // Primeiro, tentar carregar dados do formulário de registro (localStorage)
      let roleFromForm: 'cliente' | 'prestador' | null = null;
      const onboardingFormData = localStorage.getItem('onboarding_form_data');
      if (onboardingFormData) {
        try {
          const formDataFromStorage = JSON.parse(onboardingFormData);
          // Definir o tipo de conta do formulário
          if (formDataFromStorage.tipo) {
            roleFromForm = formDataFromStorage.tipo as 'cliente' | 'prestador';
            setRole(roleFromForm);
          }
          // Preencher nome e email do formulário
          setFormData(prev => ({
            ...prev,
            nome: formDataFromStorage.nome || prev.nome,
            email: formDataFromStorage.email || prev.email,
          }));
          // Limpar dados do localStorage após usar
          localStorage.removeItem('onboarding_form_data');
        } catch (error) {
          console.error('Erro ao carregar dados do formulário:', error);
        }
      }
      
      // Preencher dados do usuário se disponíveis (sobrescreve dados do formulário se necessário)
      if (profile) {
        // Se não definiu role ainda (não veio do formulário), usar do perfil
        if (!roleFromForm && profile.tipo) {
          setRole(profile.tipo as 'cliente' | 'prestador');
        }
      } else if (isGoogleAuth && !roleFromForm) {
        // Se veio do Google e não tem role definido, definir como cliente por padrão
        setRole('cliente');
        
        // Carregar serviços do prestador se existirem
        if (profile.tipo === 'prestador' && profile.prestador_servicos) {
          const servicosIds = profile.prestador_servicos.map((ps: any) => ps.servico_id);
          setFormData(prev => ({
            ...prev,
            servicos: servicosIds,
          }));
        }
        
        // Carregar cidades atendidas do prestador
        if (profile.tipo === 'prestador') {
          loadCidadesAtendidas();
        }
        
        setFormData(prev => ({
          ...prev,
          nome: prev.nome || profile.nome || '',
          email: prev.email || profile.email || user.email || '',
          cidade: profile.endereco_cidade || '',
          bio: profile.bio || '',
        }));
      } else if (user.user_metadata) {
        // Se não tem perfil ainda mas veio do Google, definir role como cliente temporariamente
        // O perfil será criado pelo useAuth e então será atualizado
        if (isGoogleAuth && !roleFromForm && !role) {
          setRole('cliente');
        }
        
        setFormData(prev => ({
          ...prev,
          nome: prev.nome || user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0] || '',
          email: prev.email || user.email || '',
        }));
      }
      
      // Carregar serviços disponíveis
      loadServicos();
    } else {
      // Se não está autenticado, redirecionar para login
      navigate('/auth');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, navigate]);

  const loadServicos = async () => {
    try {
      const servicos = await getServicos();
      setServicosDisponiveis(servicos);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  };

  const loadCidadesAtendidas = async () => {
    if (!profile) return;
    
    try {
      const { data, error } = await supabase
        .from('cidades_atendidas')
        .select('cidade')
        .eq('prestador_id', profile.id);

      if (!error && data) {
        const cidades = data.map(item => item.cidade);
        setFormData(prev => ({
          ...prev,
          cidadesAtendidas: cidades,
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar cidades atendidas:', error);
    }
  };

  const nextStep = async () => {
    if (step < steps.length - 1) {
      // Salvar dados antes de avançar (exceto na última etapa)
      if (steps[step].id !== 'done') {
        await saveStepData();
      }
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const saveStepData = async () => {
    if (!user || !profile) return;

    try {
      const updates: any = {};
      
      if (formData.nome) updates.nome = formData.nome;
      if (formData.cidade) updates.endereco_cidade = formData.cidade;
      if (formData.bio) updates.bio = formData.bio;

      if (Object.keys(updates).length > 0) {
        await updateUserProfile(profile.id, updates);
      }

      // Salvar serviços do prestador
      if (role === 'prestador' && formData.servicos.length > 0) {
        // Remover serviços existentes
        await supabase
          .from('prestador_servicos')
          .delete()
          .eq('prestador_id', profile.id);

        // Adicionar novos serviços
        const servicosToInsert = formData.servicos.map(servicoId => ({
          prestador_id: profile.id,
          servico_id: servicoId,
          preco_min: 0,
          preco_max: 0,
        }));

        await supabase
          .from('prestador_servicos')
          .insert(servicosToInsert);
      }

      // Salvar cidades atendidas
      if (role === 'prestador' && formData.cidadesAtendidas.length > 0) {
        // Remover cidades existentes
        await supabase
          .from('cidades_atendidas')
          .delete()
          .eq('prestador_id', profile.id);

        // Adicionar novas cidades
        const cidadesToInsert = formData.cidadesAtendidas.map(cidade => ({
          prestador_id: profile.id,
          cidade: cidade,
        }));

        await supabase
          .from('cidades_atendidas')
          .insert(cidadesToInsert);
      }

      await refreshProfile();
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await saveStepData();
      
      // Marcar onboarding como completo
      if (profile) {
        markOnboardingCompleted(profile.id);
      }
      
      toast({
        title: "Onboarding concluído!",
        description: "Bem-vindo ao Zurbo!",
      });
      navigate(role === 'prestador' ? '/dashboard' : '/');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao finalizar onboarding. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Componentes de Conteúdo das Etapas
  const StepContent = () => {
    const currentId = steps[step].id;

    switch (currentId) {
      case 'confirm':
        // Só mostra se não for Google Auth e email não confirmado
        if (isGoogleAuth || user?.email_confirmed_at) {
          return null; // Pula esta etapa
        }
        return (
          <div className="text-center space-y-4 py-8 animate-in zoom-in-95 duration-300">
            <div className="bg-[#FEE8D6] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-[#E05815]">
              <Mail size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[#3D342B]">Verifique seu e-mail</h2>
            <p className="text-[#8C7E72] text-sm">Enviamos um código para {formData.email}. Clique no link de confirmação para continuar.</p>
            <Button
              variant="outline"
              onClick={() => setShowEmailConfirmation(true)}
              className="text-[#E05815] border-[#E05815]"
            >
              Reenviar e-mail
            </Button>
          </div>
        );
      
      case 'profile':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-[#3D342B]">Perfil Básico</h2>
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-28 h-28 rounded-xl overflow-hidden border-2 border-[#E05815]/30">
                  <AvatarImage 
                    src={profile?.foto_url || '/reparos.png'} 
                    className="rounded-xl object-cover" 
                  />
                  <AvatarFallback className="bg-[#E6DDD5] text-[#3D342B] text-2xl rounded-xl">
                    <img 
                      src="/reparos.png" 
                      alt="Foto de perfil padrão" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 bg-[#E05815] text-white p-2.5 rounded-xl shadow-lg border-2 border-white h-auto w-auto"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await uploadProfilePicture(file);
                      await refreshProfile();
                    }
                  }}
                />
              </div>
              <p className="text-xs font-medium text-[#8C7E72] mt-3 uppercase tracking-wider">Foto de perfil</p>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="cidade" className="text-[#3D342B]">Cidade</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8C7E72]" />
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                    className="pl-10 bg-white border-[#E6DDD5] text-[#3D342B]"
                    placeholder="Sua cidade"
                  />
                </div>
              </div>
              {role === 'prestador' && (
                <div>
                  <Label htmlFor="bio" className="text-[#3D342B]">Bio/Descrição breve</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="mt-1 bg-white border-[#E6DDD5] text-[#3D342B]"
                    placeholder="Conte um pouco sobre você e seus serviços (máx. 200 caracteres)"
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-[#8C7E72] mt-1">{formData.bio.length}/200</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'services':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-[#3D342B]">Seus Serviços</h2>
            <p className="text-sm text-[#8C7E72]">Quais categorias você atende?</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {servicosDisponiveis.map(servico => {
                const isSelected = formData.servicos.includes(servico.id);
                return (
                  <button
                    key={servico.id}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        servicos: isSelected
                          ? prev.servicos.filter(id => id !== servico.id)
                          : [...prev.servicos, servico.id]
                      }));
                    }}
                    className={cn(
                      "p-4 border-2 rounded-2xl text-sm font-bold transition-all text-left flex justify-between items-center",
                      isSelected
                        ? "bg-[#FEE8D6] border-[#E05815] text-[#E05815]"
                        : "bg-white border-[#E6DDD5] text-[#3D342B] hover:bg-[#FBF7F2]"
                    )}
                  >
                    {servico.nome}
                    {isSelected && <CheckCircle className="h-5 w-5" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      
      case 'area':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-[#3D342B]">Áreas de Atendimento</h2>
            <p className="text-sm text-[#8C7E72]">Onde você oferece seus serviços?</p>
            <div className="space-y-3 mt-4">
              <Select
                value=""
                onValueChange={(value) => {
                  if (value && !formData.cidadesAtendidas.includes(value)) {
                    setFormData(prev => ({
                      ...prev,
                      cidadesAtendidas: [...prev.cidadesAtendidas, value]
                    }));
                  }
                }}
              >
                <SelectTrigger className="bg-white border-[#E6DDD5] text-[#3D342B]">
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {CIDADES_REGIAO.filter(cidade => !formData.cidadesAtendidas.includes(cidade)).map(cidade => (
                    <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.cidadesAtendidas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.cidadesAtendidas.map((cidade, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-[#FEE8D6] text-[#E05815] border-[#E05815]"
                    >
                      {cidade}
                      <button
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            cidadesAtendidas: prev.cidadesAtendidas.filter((_, i) => i !== index)
                          }));
                        }}
                        className="ml-2 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'portfolio':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-[#3D342B]">Seu Portfólio</h2>
            <p className="text-sm text-[#8C7E72]">Adicione até 3 fotos de seus melhores trabalhos anteriores.</p>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[1, 2, 3].map(i => {
                const file = formData.portfolio[i - 1];
                return (
                  <div
                    key={i}
                    onClick={() => document.getElementById(`portfolio-${i}`)?.click()}
                    className={cn(
                      "aspect-square border-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all",
                      file
                        ? "bg-white border-[#E05815]"
                        : "bg-[#FBF7F2] border-dashed border-[#E6DDD5] hover:border-[#E05815]"
                    )}
                  >
                    {file ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Portfolio ${i}`}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <>
                        <ImageIcon size={24} className="mb-1 text-[#8C7E72]" />
                        <span className="text-[10px] font-bold uppercase text-[#8C7E72]">Foto {i}</span>
                      </>
                    )}
                    <input
                      id={`portfolio-${i}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const newPortfolio = [...formData.portfolio];
                          newPortfolio[i - 1] = file;
                          setFormData(prev => ({ ...prev, portfolio: newPortfolio }));
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="bg-[#FEE8D6] p-4 rounded-2xl mt-4">
              <p className="text-xs text-[#E05815] leading-relaxed font-medium">
                💡 Dica: Prestadores com fotos reais convertem até 4x mais clientes no Zurbo.
              </p>
            </div>
          </div>
        );
      
      case 'verify':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-[#3D342B]">Verificação</h2>
            <p className="text-sm text-[#8C7E72]">Segurança é nossa prioridade. Envie seus documentos.</p>
            <ProviderVerificationUpload
              value={formData.verificacao}
              onChange={(files) => setFormData(prev => ({ ...prev, verificacao: files }))}
            />
          </div>
        );
      
      case 'address':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-[#3D342B]">Endereço Completo</h2>
            <p className="text-sm text-[#8C7E72]">Complete seu endereço para melhor localização.</p>
            <div className="space-y-3 mt-4">
              <div>
                <Label htmlFor="rua" className="text-[#3D342B]">Rua</Label>
                <Input
                  id="rua"
                  className="bg-white border-[#E6DDD5] text-[#3D342B]"
                  placeholder="Nome da rua"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="numero" className="text-[#3D342B]">Número</Label>
                  <Input
                    id="numero"
                    className="bg-white border-[#E6DDD5] text-[#3D342B]"
                    placeholder="123"
                  />
                </div>
                <div>
                  <Label htmlFor="cep" className="text-[#3D342B]">CEP</Label>
                  <Input
                    id="cep"
                    className="bg-white border-[#E6DDD5] text-[#3D342B]"
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'prefs':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-[#3D342B]">Ajustes</h2>
            <p className="text-sm text-[#8C7E72]">Configure suas preferências.</p>
            <div className="space-y-3 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notificacoes"
                  checked={formData.notificacoes}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notificacoes: checked as boolean }))}
                />
                <Label htmlFor="notificacoes" className="text-[#3D342B] cursor-pointer">
                  Receber notificações sobre novos pedidos
                </Label>
              </div>
            </div>
          </div>
        );
      
      case 'done':
        return (
          <div className="text-center space-y-6 py-12 animate-in zoom-in duration-500">
            <div className="bg-[#FEE8D6] w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto text-[#E05815] shadow-xl shadow-[#FEE8D6]">
              <CheckCircle size={56} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#3D342B]">Tudo pronto!</h2>
              <p className="text-[#8C7E72] mt-2 px-4 leading-relaxed">
                {role === 'prestador' 
                  ? 'Seu perfil profissional foi criado. Analisaremos seus dados em até 24h!' 
                  : 'Sua conta está ativa. Que tal encontrar um serviço agora?'}
              </p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4 text-center">
            <h2 className="text-xl font-bold mb-2 text-[#3D342B]">{steps[step].title}</h2>
            <p className="text-sm text-[#8C7E72] italic">Simulando tela de {steps[step].id}...</p>
          </div>
        );
    }
  };

  // Pular etapa de confirmação se for Google Auth ou email já confirmado
  // IMPORTANTE: Este useEffect deve estar ANTES de qualquer return condicional
  useEffect(() => {
    if (!role) return; // Não executar se ainda não tem role
    
    const currentStepId = steps[step].id;
    if (currentStepId === 'confirm' && (isGoogleAuth || user?.email_confirmed_at)) {
      if (step < steps.length - 1) {
        setStep(step + 1);
      }
    }
  }, [step, isGoogleAuth, user?.email_confirmed_at, steps, role]);

  // Se não tem role selecionado, aguardar carregamento ou redirecionar
  if (!role) {
    return (
      <div className="min-h-screen bg-[#FBF7F2] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#E05815] rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p className="text-[#8C7E72]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[3.5rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header com Navegação e Barra de Progresso */}
        <div className="px-8 pt-4 pb-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={prevStep} 
              disabled={step === 0}
              className={cn(
                "p-2 rounded-xl transition-colors",
                step === 0 ? 'opacity-0' : 'bg-[#FBF7F2] text-[#8C7E72] hover:bg-[#E6DDD5]'
              )}
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-[10px] font-black text-[#8C7E72] tracking-[0.2em] uppercase">
              {step + 1} / {steps.length}
            </span>
            {steps[step].optional ? (
              <button 
                onClick={nextStep} 
                className="text-xs font-bold text-[#E05815] bg-[#FEE8D6] px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
              >
                Pular
              </button>
            ) : (
              <div className="w-10"></div>
            )}
          </div>
          <div className="h-1.5 w-full bg-[#E6DDD5] rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-700 ease-out bg-[#E05815]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Área de Conteúdo */}
        <div className="flex-1 overflow-y-auto px-8 py-4 scrollbar-hide">
          <StepContent />
        </div>

        {/* Rodapé Fixo */}
        <div className="p-8 bg-white border-t border-[#E6DDD5] space-y-4">
          {step === steps.length - 1 ? (
            <Button 
              onClick={handleFinish}
              disabled={loading}
              className="w-full bg-[#E05815] text-white py-4 rounded-[1.5rem] font-bold flex items-center justify-center space-x-2 shadow-xl shadow-[#E05815]/20 active:scale-95 transition-all hover:bg-[#E05815]/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Finalizando...</span>
                </>
              ) : (
                <>
                  <span>Finalizar Onboarding</span>
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={nextStep}
              className="w-full bg-[#E05815] text-white py-4 rounded-[1.5rem] font-bold flex items-center justify-center space-x-2 shadow-xl shadow-[#E05815]/20 transition-all active:scale-95 hover:bg-[#E05815]/90"
            >
              <span>Continuar</span>
              <ChevronRight size={20} />
            </Button>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Email */}
      <EmailConfirmationModal
        isOpen={showEmailConfirmation}
        onClose={() => setShowEmailConfirmation(false)}
        email={formData.email}
        onEmailConfirmed={() => {
          setShowEmailConfirmation(false);
          nextStep();
        }}
      />
    </div>
  );
};

export default OnboardingPage;
