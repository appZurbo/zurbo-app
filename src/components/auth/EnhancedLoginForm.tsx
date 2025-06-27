
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, Phone } from 'lucide-react';

interface EnhancedLoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const EnhancedLoginForm = ({ onSuccess, onSwitchToRegister }: EnhancedLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao ZURBO.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro no login social",
        description: error.message || "Não foi possível fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Phone login implementation will be added when phone auth is fully configured
    toast({
      title: "Login por telefone",
      description: "Funcionalidade em desenvolvimento. Use email por enquanto.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      {/* Social Login Options */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
        >
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C8.396 0 8.025.044 8.025.044c0 0-.396.048-.95.177C5.78.544 4.594 1.444 3.766 2.759c-.828 1.315-1.232 2.86-1.232 4.632 0 1.774.404 3.318 1.232 4.633.828 1.315 2.014 2.215 3.309 2.548.554.129.95.177.95.177s.371.044 3.992.044c3.62 0 3.991-.044 3.991-.044s.397-.048.951-.177c1.295-.333 2.481-1.233 3.309-2.548.828-1.315 1.232-2.859 1.232-4.633 0-1.772-.404-3.317-1.232-4.632C19.406 1.444 18.22.544 16.925.221 16.371.092 15.975.044 15.975.044S15.604 0 11.983 0h.034zm-.017 2.143c3.619 0 3.99.043 3.99.043s.347.041.842.15c1.026.263 1.886.924 2.461 1.888.575.964.855 2.09.855 3.374 0 1.284-.28 2.41-.855 3.374-.575.964-1.435 1.625-2.461 1.888-.495.109-.842.15-.842.15s-.371.043-3.99.043c-3.62 0-3.991-.043-3.991-.043s-.346-.041-.841-.15c-1.026-.263-1.887-.924-2.462-1.888C3.121 10.008 2.84 8.882 2.84 7.598c0-1.284.281-2.41.856-3.374.575-.964 1.436-1.625 2.462-1.888.495-.109.841-.15.841-.15s.371-.043 3.991-.043h.01z"/>
          </svg>
          Continuar com Apple
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
        </div>
      </div>

      {/* Login Method Toggle */}
      <div className="flex rounded-lg border p-1">
        <Button
          type="button"
          variant={loginMethod === 'email' ? 'default' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => setLoginMethod('email')}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button
          type="button"
          variant={loginMethod === 'phone' ? 'default' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => setLoginMethod('phone')}
        >
          <Phone className="mr-2 h-4 w-4" />
          Telefone
        </Button>
      </div>

      {/* Login Forms */}
      {loginMethod === 'email' ? (
        <form onSubmit={handleEmailLogin} className="space-y-4">
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

          <Button type="submit" className="w-full gradient-bg" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePhoneLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="(65) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full gradient-bg" disabled={loading}>
            {loading ? 'Enviando código...' : 'Enviar código SMS'}
          </Button>
        </form>
      )}

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
    </div>
  );
};
