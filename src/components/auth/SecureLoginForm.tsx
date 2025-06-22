
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRateLimiter } from '@/hooks/useRateLimiter';
import { securityLogger } from '@/utils/securityLogger';
import { validateEmail, sanitizeText } from '@/utils/validation';
import { AlertCircle, Shield, Eye, EyeOff } from 'lucide-react';

interface SecureLoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

const SecureLoginForm = ({ onSuccess, onSwitchToRegister }: SecureLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const rateLimiter = useRateLimiter('login', {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    blockDurationMs: 30 * 60 * 1000, // 30 minutos
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rateLimiter.isBlocked) {
      const remainingMinutes = Math.ceil(rateLimiter.remainingTime / 60000);
      toast({
        title: "Muitas tentativas de login",
        description: `Tente novamente em ${remainingMinutes} minutos`,
        variant: "destructive",
      });
      await securityLogger.logSuspiciousActivity(
        `Rate limit exceeded for email: ${email}`
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = sanitizeText(email.toLowerCase());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        rateLimiter.recordAttempt();
        await securityLogger.logLoginAttempt(cleanEmail, false);
        
        if (rateLimiter.attempts >= 3) {
          await securityLogger.logSuspiciousActivity(
            `Multiple failed login attempts for email: ${cleanEmail}`
          );
        }

        throw error;
      }

      // Login bem-sucedido
      rateLimiter.reset();
      await securityLogger.logLoginAttempt(cleanEmail, true, data.user?.id);

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao ZURBO!",
      });
      
      onSuccess();
    } catch (error: any) {
      let errorMessage = "Erro no login";
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Email ou senha incorretos";
      } else if (error.message.includes('too_many_requests')) {
        errorMessage = "Muitas tentativas. Tente novamente mais tarde";
      }

      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-500" />
          Entrar
        </CardTitle>
        <CardDescription>
          Entre na sua conta do ZURBO
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rateLimiter.isBlocked && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-700">
              Muitas tentativas de login. Tente novamente em {Math.ceil(rateLimiter.remainingTime / 60000)} minutos.
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={rateLimiter.isBlocked}
            />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={rateLimiter.isBlocked}
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

          {rateLimiter.attempts > 0 && !rateLimiter.isBlocked && (
            <div className="text-sm text-orange-600">
              Tentativas restantes: {5 - rateLimiter.attempts}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-orange-500 hover:bg-orange-600" 
            disabled={loading || rateLimiter.isBlocked}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          
          <Button 
            type="button" 
            variant="link" 
            className="w-full"
            onClick={onSwitchToRegister}
          >
            Não tem conta? Cadastre-se
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecureLoginForm;
