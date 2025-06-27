
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, Phone, User, FileText } from 'lucide-react';

interface EnhancedRegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const EnhancedRegisterForm = ({ onSuccess, onSwitchToLogin }: EnhancedRegisterFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    tipo: 'cliente' as 'cliente' | 'prestador'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const { toast } = useToast();

  const handleSocialRegister = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            registro: 'true'
          }
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro no cadastro social",
        description: error.message || "Não foi possível fazer cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Erro",
        description: "Você deve aceitar os termos de uso para prosseguir.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone) {
      toast({
        title: "Erro",
        description: "O número de telefone é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nome: formData.nome,
            tipo: formData.tipo,
            telefone: formData.phone
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível criar a conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getContractTitle = () => {
    return formData.tipo === 'cliente' 
      ? 'Contrato ZURBO ↔ Cliente' 
      : 'Contrato ZURBO ↔ Prestador';
  };

  const getContractContent = () => {
    if (formData.tipo === 'cliente') {
      return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS - ZURBO ↔ CLIENTE

1. OBJETO DO CONTRATO
Este contrato estabelece os termos e condições para uso da plataforma ZURBO como cliente.

2. RESPONSABILIDADES DO CLIENTE
- Fornecer informações verdadeiras e atualizadas
- Tratar prestadores com respeito e cordialidade
- Pagar pelos serviços conforme acordado
- Avaliar prestadores de forma honesta

3. RESPONSABILIDADES DA ZURBO
- Conectar clientes a prestadores qualificados
- Manter a plataforma funcionando adequadamente
- Proteger dados pessoais conforme LGPD
- Mediar conflitos quando necessário

4. PAGAMENTOS
- Pagamentos são feitos diretamente aos prestadores
- ZURBO não se responsabiliza por transações financeiras
- Valores acordados devem ser respeitados

5. CANCELAMENTOS
- Cancelamentos devem ser comunicados com antecedência
- Políticas de cancelamento variam por prestador

6. PRIVACIDADE E DADOS
- Seus dados são protegidos conforme nossa Política de Privacidade
- Compartilhamos apenas informações necessárias para os serviços

Ao aceitar este contrato, você concorda com todos os termos acima.
      `;
    } else {
      return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS - ZURBO ↔ PRESTADOR

1. OBJETO DO CONTRATO
Este contrato estabelece os termos e condições para atuar como prestador de serviços na plataforma ZURBO.

2. RESPONSABILIDADES DO PRESTADOR
- Executar serviços com qualidade e profissionalismo
- Manter documentação e certificações em dia
- Cumprir horários e compromissos acordados
- Tratar clientes com respeito e cordialidade
- Manter perfil atualizado na plataforma

3. RESPONSABILIDADES DA ZURBO
- Conectar prestadores a clientes potenciais
- Fornecer plataforma para gestão de serviços
- Proteger dados pessoais conforme LGPD
- Suporte técnico e comercial

4. COMISSÕES E PAGAMENTOS
- ZURBO cobra taxa de administração sobre serviços
- Pagamentos são processados conforme cronograma estabelecido
- Prestador é responsável por impostos e tributos

5. QUALIDADE DOS SERVIÇOS
- Prestador deve manter padrão de qualidade
- Avaliações negativas podem resultar em suspensão
- Reclamações são investigadas individualmente

6. EXCLUSIVIDADE
- Prestador pode atuar em outras plataformas
- Deve informar indisponibilidades na agenda

7. RESCISÃO
- Qualquer parte pode rescindir com aviso prévio
- Obrigações pendentes devem ser cumpridas

Ao aceitar este contrato, você concorda com todos os termos acima.
      `;
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Register Options */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSocialRegister('google')}
          disabled={loading}
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
          onClick={() => handleSocialRegister('facebook')}
          disabled={loading}
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
          onClick={() => handleSocialRegister('apple')}
          disabled={loading}
        >
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C8.396 0 8.025.044 8.025.044c0 0-.396.048-.95.177C5.78.544 4.594 1.444 3.766 2.759c-.828 1.315-1.232 2.86-1.232 4.632 0 1.774.404 3.318 1.232 4.633.828 1.315 2.014 2.215 3.309 2.548.554.129.95.177.95.177s.371.044 3.992.044c3.62 0 3.991-.044 3.991-.044s.397-.048.951-.177c1.295-.333 2.481-1.233 3.309-2.548.828-1.315 1.232-2.859 1.232-4.633 0-1.772-.404-3.317-1.232-4.632C19.406 1.444 18.22.544 16.925.221 16.371.092 15.975.044 15.975.044S15.604 0 11.983 0h.034zm-.017 2.143c3.619 0 3.99.043 3.99.043s.347.041.842.15c1.026.263 1.886.924 2.461 1.888.575.964.855 2.09.855 3.374 0 1.284-.28 2.41-.855 3.374-.575.964-1.435 1.625-2.461 1.888-.495.109-.842.15-.842.15s-.371.043-3.99.043c-3.62 0-3.991-.043-3.991-.043s-.346-.041-.841-.15c-1.026-.263-1.887-.924-2.462-1.888C3.121 10.008 2.84 8.882 2.84 7.598c0-1.284.281-2.41.856-3.374.575-.964 1.436-1.625 2.462-1.888.495-.109.841-.15.841-.15s.371-.043 3.991-.043h.01z"/>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Type Selection */}
        <div className="space-y-3">
          <Label>Tipo de usuário</Label>
          <RadioGroup
            value={formData.tipo}
            onValueChange={(value: 'cliente' | 'prestador') => 
              setFormData(prev => ({ ...prev, tipo: value }))
            }
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cliente" id="cliente" />
              <Label htmlFor="cliente">Cliente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prestador" id="prestador" />
              <Label htmlFor="prestador">Prestador</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Phone - Mandatory */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="(65) 99999-9999"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            * Obrigatório. Não poderá ser alterado após o cadastro.
          </p>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirme sua senha"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
        </div>

        {/* Contract Agreement */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="terms" className="text-sm">
                Li e aceito o{' '}
                <Dialog open={showContract} onOpenChange={setShowContract}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
                      {getContractTitle()}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {getContractTitle()}
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-96 w-full rounded-md border p-4">
                      <pre className="whitespace-pre-wrap text-sm">{getContractContent()}</pre>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </Label>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full gradient-bg" disabled={loading || !agreedToTerms}>
          {loading ? 'Criando conta...' : 'Criar conta'}
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
    </div>
  );
};
