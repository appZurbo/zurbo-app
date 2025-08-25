
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateCPF, validateEmail, validatePassword, sanitizeText, formatCPF } from '@/utils/validation';
import { AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface RegisterFormProps {
  onSuccess: (userType: string) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    tipo: 'cliente'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'nome':
        const cleanName = sanitizeText(value);
        if (!cleanName || cleanName.length < 2) {
          newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
        } else {
          delete newErrors.nome;
        }
        break;

      case 'email':
        if (!validateEmail(value)) {
          newErrors.email = 'Email inválido';
        } else {
          delete newErrors.email;
        }
        break;

      case 'cpf':
        if (!validateCPF(value)) {
          newErrors.cpf = 'CPF inválido';
        } else {
          delete newErrors.cpf;
        }
        break;

      case 'password':
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          newErrors.password = passwordValidation.errors[0];
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Senhas não coincidem';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'cpf') {
      value = formatCPF(value);
    }
    
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
  };

  const isFormValid = () => {
    const fields = ['nome', 'email', 'cpf', 'password', 'confirmPassword'];
    return fields.every(field => {
      const value = formData[field as keyof typeof formData];
      if (!value) return false;
      
      switch (field) {
        case 'nome':
          return sanitizeText(value).length >= 2;
        case 'email':
          return validateEmail(value);
        case 'cpf':
          return validateCPF(value);
        case 'password':
          return validatePassword(value).isValid;
        case 'confirmPassword':
          return value === formData.password;
        default:
          return true;
      }
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast({
        title: "Dados inválidos",
        description: "Por favor, corrija os erros antes de continuar",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = sanitizeText(formData.email.toLowerCase());
      const cleanName = sanitizeText(formData.nome);
      const cleanCPF = formData.cpf.replace(/\D/g, '');

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.password,
        options: {
          data: {
            nome: cleanName,
            cpf: cleanCPF,
            tipo: formData.tipo
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está em uso. Tente fazer login ou use outro email.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar a conta.",
        });

        onSuccess(formData.tipo);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFieldIcon = (field: string) => {
    if (errors[field]) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    
    const value = formData[field as keyof typeof formData];
    if (value) {
      switch (field) {
        case 'nome':
          return sanitizeText(value).length >= 2 ? <CheckCircle className="h-4 w-4 text-green-500" /> : null;
        case 'email':
          return validateEmail(value) ? <CheckCircle className="h-4 w-4 text-green-500" /> : null;
        case 'cpf':
          return validateCPF(value) ? <CheckCircle className="h-4 w-4 text-green-500" /> : null;
        case 'password':
          return validatePassword(value).isValid ? <CheckCircle className="h-4 w-4 text-green-500" /> : null;
        case 'confirmPassword':
          return value === formData.password ? <CheckCircle className="h-4 w-4 text-green-500" /> : null;
      }
    }
    return null;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>
          Cadastre-se no ZURBO
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome Completo</Label>
            <div className="relative">
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                required
                maxLength={100}
                className={errors.nome ? 'border-red-500' : ''}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getFieldIcon('nome')}
              </div>
            </div>
            {errors.nome && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.nome}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className={errors.email ? 'border-red-500' : ''}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getFieldIcon('email')}
              </div>
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="cpf">CPF</Label>
            <div className="relative">
              <Input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
                required
                className={errors.cpf ? 'border-red-500' : ''}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getFieldIcon('cpf')}
              </div>
            </div>
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
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className={errors.password ? 'border-red-500' : ''}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {getFieldIcon('password')}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
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
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {getFieldIcon('confirmPassword')}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
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

          <Button 
            type="submit" 
            disabled={loading || !isFormValid()} 
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>

          <Button 
            type="button" 
            variant="link" 
            className="w-full"
            onClick={onSwitchToLogin}
          >
            Já tem conta? Entre aqui
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
