
import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
  defaultTab?: 'login' | 'register-client' | 'register-prestador';
}

const AuthModal = ({
  isOpen,
  onClose,
  onLogin,
  defaultTab = 'login'
}: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Estados para os formulários
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [clientData, setClientData] = useState({
    nome: '', email: '', telefone: '', endereco: '', password: ''
  });
  const [prestadorData, setPrestadorData] = useState({
    nome: '', email: '', telefone: '', cpf: '', cidade: '', 
    especialidade: '', preco: '', descricao: '', password: ''
  });

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(loginData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(loginData.password)) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao ZURBO!",
      });
      
      onLogin(data.user);
      onClose();
    } catch (error: any) {
      let errorMessage = "Erro no login";
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Email ou senha incorretos";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Por favor, confirme seu email antes de fazer login";
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

  const handleRegisterClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(clientData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(clientData.password)) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: clientData.email,
        password: clientData.password,
        options: {
          data: {
            nome: clientData.nome,
            tipo: 'cliente',
            telefone: clientData.telefone,
            endereco_completo: clientData.endereco
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar a conta",
      });
      
      onClose();
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

  const handleRegisterPrestador = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(prestadorData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(prestadorData.password)) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: prestadorData.email,
        password: prestadorData.password,
        options: {
          data: {
            nome: prestadorData.nome,
            tipo: 'prestador',
            telefone: prestadorData.telefone,
            cpf: prestadorData.cpf,
            endereco_cidade: prestadorData.cidade,
            especialidade: prestadorData.especialidade,
            preco_servico: prestadorData.preco,
            descricao_servico: prestadorData.descricao
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar a conta",
      });
      
      onClose();
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button variant="ghost" size="sm" className="absolute right-2 top-2" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-center">
            Bem-vindo ao <span className="gradient-bg bg-clip-text text-orange-600">zurbo.</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={value => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register-client">Cliente</TabsTrigger>
              <TabsTrigger value="register-prestador">Prestador</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required 
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2" 
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
            </TabsContent>

            <TabsContent value="register-client">
              <form onSubmit={handleRegisterClient} className="space-y-4">
                <div>
                  <Label htmlFor="client-name">Nome completo</Label>
                  <Input 
                    id="client-name" 
                    value={clientData.nome}
                    onChange={(e) => setClientData({...clientData, nome: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="client-email">E-mail</Label>
                  <Input 
                    id="client-email" 
                    type="email" 
                    value={clientData.email}
                    onChange={(e) => setClientData({...clientData, email: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="client-phone">Telefone</Label>
                  <Input 
                    id="client-phone" 
                    type="tel" 
                    value={clientData.telefone}
                    onChange={(e) => setClientData({...clientData, telefone: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="client-address">Endereço completo</Label>
                  <Textarea 
                    id="client-address" 
                    value={clientData.endereco}
                    onChange={(e) => setClientData({...clientData, endereco: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="client-password">Senha</Label>
                  <Input 
                    id="client-password" 
                    type="password" 
                    value={clientData.password}
                    onChange={(e) => setClientData({...clientData, password: e.target.value})}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full gradient-bg" disabled={loading}>
                  {loading ? 'Cadastrando...' : 'Cadastrar como Cliente'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register-prestador">
              <form onSubmit={handleRegisterPrestador} className="space-y-4">
                <div>
                  <Label htmlFor="prestador-name">Nome completo</Label>
                  <Input 
                    id="prestador-name" 
                    value={prestadorData.nome}
                    onChange={(e) => setPrestadorData({...prestadorData, nome: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="prestador-email">E-mail</Label>
                  <Input 
                    id="prestador-email" 
                    type="email" 
                    value={prestadorData.email}
                    onChange={(e) => setPrestadorData({...prestadorData, email: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="prestador-phone">Telefone</Label>
                  <Input 
                    id="prestador-phone" 
                    type="tel" 
                    value={prestadorData.telefone}
                    onChange={(e) => setPrestadorData({...prestadorData, telefone: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="prestador-document">CPF/CNPJ</Label>
                  <Input 
                    id="prestador-document" 
                    value={prestadorData.cpf}
                    onChange={(e) => setPrestadorData({...prestadorData, cpf: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="prestador-city">Cidade/Estado</Label>
                  <Input 
                    id="prestador-city" 
                    value={prestadorData.cidade}
                    onChange={(e) => setPrestadorData({...prestadorData, cidade: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="prestador-specialty">Especialidade</Label>
                  <Select value={prestadorData.especialidade} onValueChange={(value) => setPrestadorData({...prestadorData, especialidade: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="limpeza">Limpeza</SelectItem>
                      <SelectItem value="reparos">Reparos</SelectItem>
                      <SelectItem value="eletrica">Elétrica</SelectItem>
                      <SelectItem value="beleza">Beleza</SelectItem>
                      <SelectItem value="jardinagem">Jardinagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="prestador-price">Valor por serviço (R$)</Label>
                  <Input 
                    id="prestador-price" 
                    type="number" 
                    value={prestadorData.preco}
                    onChange={(e) => setPrestadorData({...prestadorData, preco: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="prestador-description">Descrição do serviço</Label>
                  <Textarea 
                    id="prestador-description" 
                    value={prestadorData.descricao}
                    onChange={(e) => setPrestadorData({...prestadorData, descricao: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="prestador-password">Senha</Label>
                  <Input 
                    id="prestador-password" 
                    type="password" 
                    value={prestadorData.password}
                    onChange={(e) => setPrestadorData({...prestadorData, password: e.target.value})}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full gradient-bg" disabled={loading}>
                  {loading ? 'Cadastrando...' : 'Cadastrar como Prestador'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;
