import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, User, Lock, Shield, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuthSecurity } from '@/hooks/useAuthSecurity';
import { EmailConfirmationModal } from './EmailConfirmationModal';

interface SecureEnhancedRegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const SecureEnhancedRegisterForm = ({ onSuccess, onSwitchToLogin }: SecureEnhancedRegisterFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipo: 'cliente' as 'cliente' | 'prestador'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { toast } = useToast();
  const { secureSignUp, isLoading: securityLoading } = useAuthSecurity();

  const validatePassword = (password: string) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return {
      isValid: Object.values(checks).every(Boolean),
      checks
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.nome || !formData.email || !formData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (!passwordValidation.isValid) {
      toast({
        title: "Senha não atende aos requisitos",
        description: "Verifique os requisitos de segurança da senha.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await secureSignUp(
        formData.email,
        formData.password,
        {
          nome: formData.nome,
          tipo: formData.tipo
        }
      );
      
      if (!result.success) {
        if (result.isBlocked) {
          toast({
            title: "Registro bloqueado temporariamente",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: result.error || "Não foi possível criar sua conta.",
            variant: "destructive",
          });
        }
        return;
      }

      // Mostrar modal de confirmação de email
      setRegisteredEmail(formData.email);
      setShowEmailConfirmation(true);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar sua conta.",
      });

    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro interno. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Redirecionando...",
        description: "Você será redirecionado para criar sua conta.",
      });
    } catch (error: any) {
      let errorMessage = "Verifique se o provedor está configurado corretamente.";
      
      if (error.message?.includes('provider not found')) {
        errorMessage = "Provedor de cadastro não configurado.";
      }
      
      toast({
        title: "Erro no cadastro social",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header com indicação de segurança */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Cadastro Seguro</h2>
        </div>
        <p className="text-muted-foreground">Crie sua conta com total proteção</p>
      </div>

      {/* Social Sign Up Options */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSocialSignUp('google')}
          disabled={loading || securityLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Cadastrar com Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSocialSignUp('facebook')}
          disabled={loading || securityLoading}
        >
          <svg className="mr-2 h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Cadastrar com Facebook
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSocialSignUp('apple')}
          disabled={loading || securityLoading}
        >
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
          </svg>
          Cadastrar com Apple
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou cadastre-se com email</span>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={(e) => updateFormData('nome', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de conta</Label>
          <div className="flex rounded-lg border p-1">
            <Button
              type="button"
              variant={formData.tipo === 'cliente' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => updateFormData('tipo', 'cliente')}
            >
              Cliente
            </Button>
            <Button
              type="button"
              variant={formData.tipo === 'prestador' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => updateFormData('tipo', 'prestador')}
            >
              Prestador de Serviços
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Password strength indicator */}
          {formData.password && (
            <div className="space-y-2 text-xs">
              <p className="font-medium">Requisitos de segurança:</p>
              <div className="grid grid-cols-2 gap-1">
                <div className={`flex items-center gap-1 ${passwordValidation.checks.length ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordValidation.checks.length ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  Mín. 8 caracteres
                </div>
                <div className={`flex items-center gap-1 ${passwordValidation.checks.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordValidation.checks.uppercase ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  Letra maiúscula
                </div>
                <div className={`flex items-center gap-1 ${passwordValidation.checks.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordValidation.checks.lowercase ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  Letra minúscula
                </div>
                <div className={`flex items-center gap-1 ${passwordValidation.checks.number ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordValidation.checks.number ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  Número
                </div>
                <div className={`flex items-center gap-1 ${passwordValidation.checks.special ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordValidation.checks.special ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  Caractere especial
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirme sua senha"
              value={formData.confirmPassword}
              onChange={(e) => updateFormData('confirmPassword', e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              As senhas não coincidem
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full gradient-bg" 
          disabled={loading || securityLoading || !passwordValidation.isValid}
        >
          {(loading || securityLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {securityLoading ? 'Verificando segurança...' : loading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToLogin}
          className="text-sm"
        >
          Já tem uma conta? Faça login
        </Button>
      </div>

      {/* Indicadores de segurança */}
      <div className="text-xs text-center text-muted-foreground space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-3 w-3" />
          <span>Registro protegido por validação de segurança</span>
        </div>
        <p>• Confirmação de email obrigatória • Senhas criptografadas • Anti-spam ativo</p>
      </div>

      <EmailConfirmationModal
        isOpen={showEmailConfirmation}
        onClose={() => setShowEmailConfirmation(false)}
        email={registeredEmail}
        onEmailConfirmed={() => {
          setShowEmailConfirmation(false);
          onSwitchToLogin();
          toast({
            title: "Agora você pode fazer login!",
            description: "Sua conta foi confirmada com sucesso.",
          });
        }}
      />
    </div>
  );
};