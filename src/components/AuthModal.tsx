import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  if (!isOpen) return null;
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login
    onLogin({
      name: 'João Silva',
      email: 'joao@email.com',
      type: 'cliente'
    });
    onClose();
  };
  const handleRegisterClient = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: 'Maria Santos',
      email: 'maria@email.com',
      type: 'cliente'
    });
    onClose();
  };
  const handleRegisterPrestador = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: 'Carlos Pereira',
      email: 'carlos@email.com',
      type: 'prestador'
    });
    onClose();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                  <Input id="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} required />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-bg">
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register-client">
              <form onSubmit={handleRegisterClient} className="space-y-4">
                <div>
                  <Label htmlFor="client-name">Nome completo</Label>
                  <Input id="client-name" required />
                </div>
                <div>
                  <Label htmlFor="client-email">E-mail</Label>
                  <Input id="client-email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="client-phone">Telefone</Label>
                  <Input id="client-phone" type="tel" required />
                </div>
                <div>
                  <Label htmlFor="client-address">Endereço completo</Label>
                  <Textarea id="client-address" required />
                </div>
                <div>
                  <Label htmlFor="client-password">Senha</Label>
                  <Input id="client-password" type="password" required />
                </div>
                <Button type="submit" className="w-full gradient-bg">
                  Cadastrar como Cliente
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register-prestador">
              <form onSubmit={handleRegisterPrestador} className="space-y-4">
                <div>
                  <Label htmlFor="prestador-name">Nome completo</Label>
                  <Input id="prestador-name" required />
                </div>
                <div>
                  <Label htmlFor="prestador-email">E-mail</Label>
                  <Input id="prestador-email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="prestador-phone">Telefone</Label>
                  <Input id="prestador-phone" type="tel" required />
                </div>
                <div>
                  <Label htmlFor="prestador-document">CPF/CNPJ</Label>
                  <Input id="prestador-document" required />
                </div>
                <div>
                  <Label htmlFor="prestador-city">Cidade/Estado</Label>
                  <Input id="prestador-city" required />
                </div>
                <div>
                  <Label htmlFor="prestador-specialty">Especialidade</Label>
                  <Select>
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
                  <Input id="prestador-price" type="number" required />
                </div>
                <div>
                  <Label htmlFor="prestador-description">Descrição do serviço</Label>
                  <Textarea id="prestador-description" required />
                </div>
                <div>
                  <Label htmlFor="prestador-password">Senha</Label>
                  <Input id="prestador-password" type="password" required />
                </div>
                <Button type="submit" className="w-full gradient-bg">
                  Cadastrar como Prestador
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>;
};
export default AuthModal;