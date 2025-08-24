
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Shield } from 'lucide-react';
import { useAuthSecurity } from '@/hooks/useAuthSecurity';

interface SecureEnhancedRegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const SecureEnhancedRegisterForm: React.FC<SecureEnhancedRegisterFormProps> = ({ 
  onSuccess, 
  onSwitchToLogin 
}) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [endereco, setEndereco] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('cliente');
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { secureSignUp } = useAuthSecurity();

  const cidades = ['Sinop', 'Sorriso', 'Lucas do Rio Verde'];
  const bairros = ['Setor Industrial', 'Jardim Botânico', 'Residencial Aquarela'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !password || !confirmPassword || !telefone || !cidade || !bairro || !endereco || !termosAceitos) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas devem ser iguais.");
      return;
    }

    setLoading(true);
    try {
      const result = await secureSignUp(email, password, {
        nome,
        telefone,
        cidade,
        bairro,
        endereco,
        tipoUsuario,
      });

      if (result.success) {
        toast.success("Sua conta foi criada com sucesso! Verifique seu email para confirmação.");
        onSuccess?.();
      } else {
        toast.error(result.error || "Ocorreu um erro ao criar sua conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Criar uma conta segura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha segura"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              type="tel"
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(66) 99999-9999"
            />
          </div>
          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Select value={cidade} onValueChange={setCidade}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent>
                {cidades.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bairro">Bairro</Label>
            <Select value={bairro} onValueChange={setBairro}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o bairro" />
              </SelectTrigger>
              <SelectContent>
                {bairros.map((neighborhood) => (
                  <SelectItem key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              type="text"
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, complemento"
            />
          </div>
          <div>
            <Label htmlFor="tipoUsuario">Tipo de Usuário</Label>
            <Select value={tipoUsuario} onValueChange={setTipoUsuario}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="prestador">Prestador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="termos">
              <div className="flex items-center">
                <Checkbox
                  id="termos"
                  checked={termosAceitos}
                  onCheckedChange={(checked) => setTermosAceitos(!!checked)}
                />
                <span className="ml-2">Aceito os termos de uso e política de privacidade</span>
              </div>
            </Label>
          </div>
          <Button disabled={loading} className="w-full">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Criar Conta'
            )}
          </Button>
        </form>
        
        {onSwitchToLogin && (
          <div className="text-center">
            <Button 
              variant="link" 
              onClick={onSwitchToLogin}
              className="text-sm"
            >
              Já tem uma conta? Faça login
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
