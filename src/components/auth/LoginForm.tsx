
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, sanitizeText } from '@/utils/validation';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm = ({ onSuccess, onSwitchToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

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
        return;
      }

      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao ZURBO!",
        });

        // Aguarda um momento para o estado de autenticação ser atualizado
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
          navigate('/', { replace: true });
        }, 100);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      
      <Button 
        type="submit" 
        className="w-full bg-orange-500 hover:bg-orange-600" 
        disabled={loading}
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
  );
};

export default LoginForm;
