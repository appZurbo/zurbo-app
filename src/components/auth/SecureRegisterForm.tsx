
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateCPF, validateEmail, validatePassword, sanitizeText, formatCPF } from '@/utils/validation';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import LocationConsentDialog from './LocationConsentDialog';
import { useSecureLocation } from '@/hooks/useSecureLocation';

interface SecureRegisterFormProps {
  onSuccess: (userType: string) => void;
  onSwitchToLogin: () => void;
}

const SecureRegisterForm = ({ onSuccess, onSwitchToLogin }: SecureRegisterFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    tipo: 'cliente'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { latitude, longitude, requestLocation } = useSecureLocation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate and sanitize name
    const cleanName = sanitizeText(formData.nome);
    if (!cleanName || cleanName.length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validate CPF
    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
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
          }
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
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            auth_id: data.user.id,
            nome: sanitizeText(formData.nome),
            email: formData.email,
            cpf: formData.cpf.replace(/\D/g, ''),
            tipo: formData.tipo,
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
    
    if (!validateForm()) {
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

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600">
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

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
    </>
  );
};

export default SecureRegisterForm;
