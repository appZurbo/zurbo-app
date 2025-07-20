
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, Shield, Loader2 } from 'lucide-react';
import { useAuthSecurity } from '@/hooks/useAuthSecurity';
import { EmailConfirmationModal } from './EmailConfirmationModal';

interface SecureEnhancedLoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const SecureEnhancedLoginForm = ({ onSuccess, onSwitchToRegister }: SecureEnhancedLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState('');
  const { toast } = useToast();
  const { secureSignIn, isLoading: securityLoading } = useAuthSecurity();

  // Get the correct redirect URL
  const getRedirectUrl = () => {
    const currentUrl = window.location.origin;
    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      return currentUrl;
    }
    return 'https://zurbo.com.br';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha para continuar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await secureSignIn(email, password);
      
      if (!result.success) {
        if (result.error?.includes('confirme seu email') || result.error?.includes('email ainda não foi confirmado')) {
          setPendingConfirmationEmail(email);
          setShowEmailConfirmation(true);
        } else if (result.isBlocked) {
          toast({
            title: "Conta temporariamente bloqueada",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no login",
            description: result.error || "Credenciais inválidas. Tente novamente.",
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao ZURBO!",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Erro interno. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    try {
      const redirectUrl = getRedirectUrl();
      console.log('Using redirect URL for social login:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
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
        title: "Redirecionando...",
        description: "Você será redirecionado para fazer login.",
      });
    } catch (error: any) {
      let errorMessage = "Verifique se o provedor está configurado corretamente.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Credenciais inválidas para este provedor.";
      } else if (error.message?.includes('provider not found')) {
        errorMessage = "Provedor de login não configurado.";
      }
      
      toast({
        title: "Erro no login social",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com indicação de segurança */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Login Seguro</h2>
        </div>
        <p className="text-muted-foreground">Entre na sua conta com total segurança</p>
      </div>

      {/* Social Login Options */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSocialLogin('google')}
          disabled={loading || securityLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar com Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSocialLogin('facebook')}
          disabled={loading || securityLoading}
        >
          <svg className="mr-2 h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continuar com Facebook
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSocialLogin('apple')}
          disabled={loading || securityLoading}
        >
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
          </svg>
          Continuar com Apple
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou continue com email</span>
        </div>
      </div>

      {/* Email Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <Button 
          type="submit" 
          className="w-full gradient-bg" 
          disabled={loading || securityLoading}
        >
          {(loading || securityLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {securityLoading ? 'Verificando segurança...' : loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToRegister}
          className="text-sm"
        >
          Não tem uma conta? Cadastre-se
        </Button>
      </div>

      {/* Indicadores de segurança */}
      <div className="text-xs text-center text-muted-foreground space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-3 w-3" />
          <span>Protegido por autenticação segura</span>
        </div>
        <p>• Rate limiting ativo • Emails temporários bloqueados • Logs de auditoria</p>
      </div>

      <EmailConfirmationModal
        isOpen={showEmailConfirmation}
        onClose={() => setShowEmailConfirmation(false)}
        email={pendingConfirmationEmail}
        onEmailConfirmed={() => {
          setShowEmailConfirmation(false);
          toast({
            title: "Tente fazer login novamente",
            description: "Se você confirmou seu email, tente fazer login.",
          });
        }}
      />
    </div>
  );
};
