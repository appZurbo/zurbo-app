import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateCPF, validateEmail, validatePassword, sanitizeText, formatCPF } from '@/utils/validation';
import { AlertCircle, Eye, EyeOff, MapPin, User, FileText } from 'lucide-react';
import LocationConsentDialog from './LocationConsentDialog';
import { useSecureLocation } from '@/hooks/useSecureLocation';
import { getCidades } from '@/utils/database';
import { fetchActiveLegalDocument, mapUserTipoToDocType, savePendingAcceptance, type LegalDocument } from '@/utils/legal';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ExtendedRegisterFormProps {
  onSuccess: (userType: string) => void;
  onSwitchToLogin: () => void;
}

const ExtendedRegisterForm = ({ onSuccess, onSwitchToLogin }: ExtendedRegisterFormProps) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    // Dados básicos
    nome: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    tipo: 'cliente',
    // Dados de localização
    endereco_rua: '',
    endereco_numero: '',
    endereco_bairro: '',
    endereco_cidade: '',
    endereco_cep: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cidades, setCidades] = useState<any[]>([]);
  const { toast } = useToast();
  const { latitude, longitude, requestLocation } = useSecureLocation();

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [legalDoc, setLegalDoc] = useState<LegalDocument | null>(null);
  const [showContract, setShowContract] = useState(false);

  useEffect(() => {
    loadCidades();
  }, []);

  useEffect(() => {
    const loadDoc = async () => {
      const docType = mapUserTipoToDocType(formData.tipo);
      const doc = await fetchActiveLegalDocument(docType);
      setLegalDoc(doc);
    };
    loadDoc();
  }, [formData.tipo]);

  const loadCidades = async () => {
    const cidadesData = await getCidades();
    setCidades(cidadesData);
  };

  const validateBasicForm = () => {
    const newErrors: Record<string, string> = {};

    const cleanName = sanitizeText(formData.nome);
    if (!cleanName || cleanName.length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!agreedToTerms) {
      newErrors.termos = 'Você deve aceitar os termos para continuar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocationConsent = (granted: boolean) => {
    setShowLocationDialog(false);
    if (granted) {
      requestLocation(() => {
        proceedWithRegistration();
      });
    } else {
      proceedWithRegistration();
    }
  };

  const proceedWithRegistration = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome: sanitizeText(formData.nome),
            cpf: formData.cpf.replace(/\D/g, ''),
            tipo: formData.tipo
          },
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        if (error.message.includes('duplicate')) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está em uso. Tente fazer login ou use outro email.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      if (data.user) {
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', data.user.id)
          .maybeSingle();

        if (!existing) {
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              auth_id: data.user.id,
              nome: sanitizeText(formData.nome),
              email: formData.email,
              cpf: formData.cpf.replace(/\D/g, ''),
              tipo: formData.tipo,
              endereco_rua: formData.endereco_rua?.trim() || null,
              endereco_numero: formData.endereco_numero?.trim() || null,
              endereco_bairro: formData.endereco_bairro?.trim() || null,
              endereco_cidade: formData.endereco_cidade?.trim() || null,
              endereco_cep: formData.endereco_cep?.trim() || null,
              latitude: latitude,
              longitude: longitude
            });

          if (profileError) {
            if (profileError.message.includes('unique_cpf')) {
              toast({
                title: "CPF já cadastrado",
                description: "Este CPF já está em uso no sistema.",
                variant: "destructive",
              });
            } else {
              throw profileError;
            }
            return;
          }
        }

        if (legalDoc) {
          savePendingAcceptance(legalDoc);
        }

        toast({
          title: "Cadastro realizado!",
          description: "Bem-vindo ao ZURBO! Verifique seu email para confirmar a conta.",
        });

        onSuccess(formData.tipo);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateBasicForm()) {
      setActiveTab('basic');
      return;
    }

    if (formData.tipo === 'prestador') {
      setShowLocationDialog(true);
    } else {
      await proceedWithRegistration();
    }
  };

  const handleCPFChange = (value: string) => {
    const formattedCPF = formatCPF(value);
    setFormData({ ...formData, cpf: formattedCPF });
    if (errors.cpf && validateCPF(value)) {
      setErrors({ ...errors, cpf: '' });
    }
  };

  const canProceedToLocation = () => {
    return validateBasicForm();
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Dados Básicos
              </TabsTrigger>
              <TabsTrigger 
                value="location" 
                className="flex items-center gap-2"
                disabled={!canProceedToLocation()}
              >
                <MapPin className="h-4 w-4" />
                Localização
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                    maxLength={100}
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.nome}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleCPFChange(e.target.value)}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                  {errors.cpf && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.cpf}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Tipo de Conta</Label>
                  <RadioGroup
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cliente" id="cliente" />
                      <Label htmlFor="cliente">Cliente - Quero contratar serviços</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="prestador" id="prestador" />
                      <Label htmlFor="prestador">Prestador - Quero oferecer serviços</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="agree"
                      checked={agreedToTerms}
                      onCheckedChange={(c) => setAgreedToTerms(!!c)}
                    />
                    <Label htmlFor="agree" className="text-sm">
                      Li e aceito os{' '}
                      <button
                        type="button"
                        className="text-blue-600 underline-offset-2 hover:underline"
                        onClick={() => setShowContract(true)}
                      >
                        {formData.tipo === 'cliente' ? 'Termos do Cliente' : 'Contrato do Prestador'}
                      </button>
                    </Label>
                  </div>
                  {errors.termos && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.termos}
                    </p>
                  )}
                  {legalDoc?.summary && (
                    <p className="text-xs text-muted-foreground whitespace-pre-line">
                      {legalDoc.summary}
                    </p>
                  )}
                </div>

                <Button 
                  type="button" 
                  onClick={() => canProceedToLocation() && setActiveTab('location')}
                  disabled={!canProceedToLocation()}
                  className="w-full"
                >
                  Próximo: Localização
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="location">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Opcional:</strong> Estas informações ajudam a encontrar prestadores próximos a você e são mantidas privadas.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="endereco_rua">Rua/Avenida</Label>
                    <Input
                      id="endereco_rua"
                      value={formData.endereco_rua}
                      onChange={(e) => setFormData({ ...formData, endereco_rua: e.target.value })}
                      placeholder="Nome da rua (opcional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endereco_numero">Número</Label>
                    <Input
                      id="endereco_numero"
                      value={formData.endereco_numero}
                      onChange={(e) => setFormData({ ...formData, endereco_numero: e.target.value })}
                      placeholder="Número (opcional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endereco_bairro">Bairro</Label>
                    <Input
                      id="endereco_bairro"
                      value={formData.endereco_bairro}
                      onChange={(e) => setFormData({ ...formData, endereco_bairro: e.target.value })}
                      placeholder="Bairro (opcional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endereco_cidade">Cidade</Label>
                    <Input
                      id="endereco_cidade"
                      value={formData.endereco_cidade}
                      onChange={(e) => setFormData({ ...formData, endereco_cidade: e.target.value })}
                      placeholder="Sua cidade"
                      list="cidades-list"
                    />
                    <datalist id="cidades-list">
                      {cidades.map((cidade) => (
                        <option key={cidade.id} value={cidade.nome} />
                      ))}
                    </datalist>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="endereco_cep">CEP</Label>
                    <Input
                      id="endereco_cep"
                      value={formData.endereco_cep}
                      onChange={(e) => setFormData({ ...formData, endereco_cep: e.target.value })}
                      placeholder="00000-000 (opcional)"
                      maxLength={9}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab('basic')}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleSubmit}
                    disabled={loading} 
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-center mt-4 text-sm text-gray-600">
            Já tem uma conta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Fazer login
            </button>
          </p>
        </CardContent>
      </Card>

      <LocationConsentDialog
        open={showLocationDialog}
        onConsent={handleLocationConsent}
      />

      <Dialog open={showContract} onOpenChange={setShowContract}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {formData.tipo === 'cliente' ? 'Termos do Cliente' : 'Contrato do Prestador'}
            </DialogTitle>
          </DialogHeader>
          <div className="h-96 w-full rounded-md border p-4 overflow-auto">
            <pre className="whitespace-pre-wrap text-sm">
              {legalDoc?.content || ''}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExtendedRegisterForm;
