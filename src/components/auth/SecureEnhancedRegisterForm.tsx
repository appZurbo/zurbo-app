import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, User, Lock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuthSecurity } from '@/hooks/useAuthSecurity';
import { EmailConfirmationModal } from './EmailConfirmationModal';
import { motion } from 'framer-motion';

interface SecureEnhancedRegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const SecureEnhancedRegisterForm = ({ onSuccess, onSwitchToLogin }: SecureEnhancedRegisterFormProps) => {
  const navigate = useNavigate();
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
      const defaultAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.nome)}`;

      const result = await secureSignUp(
        formData.email,
        formData.password,
        {
          nome: formData.nome,
          tipo: formData.tipo,
          foto_url: defaultAvatarUrl
        }
      );

      // Se o usuário foi criado, permitir continuar mesmo com erro no email
      if (result.success || result.userCreated) {
        // Salvar dados do formulário no localStorage para usar no onboarding
        localStorage.setItem('onboarding_form_data', JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          tipo: formData.tipo,
          foto_url: defaultAvatarUrl
        }));

        // Redirecionar para onboarding
        if (result.userCreated && result.error) {
          // Avisar sobre o erro no email mas permitir continuar
          toast({
            title: "Conta criada com sucesso!",
            description: "Complete seu perfil para começar. Nota: Houve um problema ao enviar o email de confirmação, mas você pode continuar.",
          });
        } else {
          toast({
            title: "Conta criada com sucesso!",
            description: "Complete seu perfil para começar.",
          });
        }

        // Aguardar um pouco para o toast aparecer antes de redirecionar
        setTimeout(() => {
          navigate('/onboarding');
        }, 500);
        return;
      }

      // Se não foi criado e não foi bloqueado, mostrar erro
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

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Redirecionando para Google...",
        description: "Você será redirecionado para criar sua conta com Google.",
      });
    } catch (error: any) {
      let errorMessage = "Erro ao conectar com Google. Tente novamente.";

      if (error.message?.includes('provider not found')) {
        errorMessage = "Cadastro com Google não está configurado.";
      }

      toast({
        title: "Erro no cadastro com Google",
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Google Login Option */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all gap-3 font-semibold text-gray-700 shadow-sm"
          onClick={handleGoogleSignUp}
          disabled={loading || securityLoading}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Cadastrar com Google
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-gray-400 font-medium tracking-wider">Ou e-mail</span>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="nome" className="text-gray-700 font-semibold ml-1">Nome completo</Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={(e) => updateFormData('nome', e.target.value)}
              className="h-12 pl-12 rounded-xl border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-gray-700 font-semibold ml-1">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              className="h-12 pl-12 rounded-xl border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tipo" className="text-gray-700 font-semibold ml-1">Vou usar para...</Label>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
            <Button
              type="button"
              variant={formData.tipo === 'cliente' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-lg transition-all font-bold ${formData.tipo === 'cliente' ? 'bg-white text-orange-600 shadow-sm hover:bg-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
              onClick={() => updateFormData('tipo', 'cliente')}
            >
              Pedir serviços
            </Button>
            <Button
              type="button"
              variant={formData.tipo === 'prestador' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-lg transition-all font-bold ${formData.tipo === 'prestador' ? 'bg-white text-orange-600 shadow-sm hover:bg-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
              onClick={() => updateFormData('tipo', 'prestador')}
            >
              Trabalhar
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" title="password" className="text-gray-700 font-semibold ml-1">Senha</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Crie uma senha forte"
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              className="h-12 pl-12 pr-12 rounded-xl border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
              autoComplete="new-password"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
          </div>

          {/* Password strength indicator */}
          {formData.password && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2"
            >
              <p className="font-semibold text-gray-600 mb-1">Requisitos:</p>
              <div className="grid grid-cols-1 gap-1">
                <div className={`flex items-center gap-1.5 ${passwordValidation.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordValidation.checks.length ? <CheckCircle className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-current" />}
                  Mínimo de 8 caracteres
                </div>
                <div className={`flex items-center gap-1.5 ${passwordValidation.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordValidation.checks.uppercase ? <CheckCircle className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-current" />}
                  Letras maiúsculas e minúsculas
                </div>
                <div className={`flex items-center gap-1.5 ${passwordValidation.checks.number && passwordValidation.checks.special ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordValidation.checks.number && passwordValidation.checks.special ? <CheckCircle className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-current" />}
                  Números e caracteres especiais
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" title="confirmPassword" className="text-gray-700 font-semibold ml-1">Confirmar senha</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Digite novamente"
              value={formData.confirmPassword}
              onChange={(e) => updateFormData('confirmPassword', e.target.value)}
              className="h-12 pl-12 pr-12 rounded-xl border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
              autoComplete="new-password"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1 ml-1">
              <AlertTriangle className="h-3 w-3" />
              As senhas não coincidem
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-100 transition-all active:scale-[0.98] mt-2"
          disabled={loading || securityLoading || !passwordValidation.isValid}
        >
          {(loading || securityLoading) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {securityLoading ? 'Verificando...' : loading ? 'Criando...' : 'Criar minha conta'}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-gray-500 font-medium">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-orange-500 hover:text-orange-600 font-bold underline underline-offset-4"
          >
            Fazer login
          </button>
        </p>
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