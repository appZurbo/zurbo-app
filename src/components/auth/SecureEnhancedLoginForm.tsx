import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthSecurity } from '@/hooks/useAuthSecurity';
import { EmailConfirmationModal } from './EmailConfirmationModal';
import { motion } from 'framer-motion';

interface SecureEnhancedLoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const SecureEnhancedLoginForm = ({ onSuccess, onSwitchToRegister }: SecureEnhancedLoginFormProps) => {
  const navigate = useNavigate();
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const redirectUrl = getRedirectUrl();
      console.log('Using redirect URL for Google login:', redirectUrl);

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
        description: "Você será redirecionado para fazer login com sua conta Google.",
      });
    } catch (error: any) {
      let errorMessage = "Erro ao conectar com Google. Tente novamente.";

      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Credenciais inválidas para Google.";
      } else if (error.message?.includes('provider not found')) {
        errorMessage = "Login com Google não está configurado.";
      }

      toast({
        title: "Erro no login com Google",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Google Login Option */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all gap-3 font-semibold text-gray-700 shadow-sm"
          onClick={handleGoogleLogin}
          disabled={loading || securityLoading}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuar com Google
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

      {/* Email Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-gray-700 font-semibold ml-1">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 pl-12 rounded-xl border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between ml-1">
            <Label htmlFor="password" title="password" className="text-gray-700 font-semibold">Senha</Label>
            <button type="button" className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              Esqueceu?
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pl-12 pr-12 rounded-xl border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
              autoComplete="current-password"
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
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-100 transition-all active:scale-[0.98] mt-2"
          disabled={loading || securityLoading}
        >
          {(loading || securityLoading) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {securityLoading ? 'Verificando...' : loading ? 'Entrando...' : 'Entrar na Zurbo'}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-gray-500 font-medium">
          Ainda não tem conta?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-orange-500 hover:text-orange-600 font-bold underline underline-offset-4"
          >
            Cadastre-se agora
          </button>
        </p>
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
