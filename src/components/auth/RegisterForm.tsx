
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onSuccess: (userType: string) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    cpf: '',
    tipo: 'cliente'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome: formData.nome,
            tipo: formData.tipo,
            cpf: formData.cpf
          }
        }
      });

      if (authError) throw authError;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Bem-vindo ao ZURBO!",
      });
      
      onSuccess(formData.tipo);
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength={6}
            />
          </div>
          
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={formData.cpf}
              onChange={(e) => setFormData({...formData, cpf: formatCPF(e.target.value)})}
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />
          </div>
          
          <div>
            <Label>Tipo de Conta</Label>
            <RadioGroup 
              value={formData.tipo} 
              onValueChange={(value) => setFormData({...formData, tipo: value})}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cliente" id="cliente" />
                <Label htmlFor="cliente">Cliente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prestador" id="prestador" />
                <Label htmlFor="prestador">Prestador de Serviços</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Criar Conta'}
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
