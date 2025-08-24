import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface EnhancedRegisterFormProps {
  onSuccess?: () => void;
}

export const EnhancedRegisterForm: React.FC<EnhancedRegisterFormProps> = ({ onSuccess }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [endereco, setEndereco] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const cidades = ['Sinop', 'Sorriso', 'Lucas do Rio Verde'];
  const bairros = ['Centro', 'Jardim Botânico', 'Setor Industrial'];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!termosAceitos) {
      toast.error('Você precisa aceitar os termos de uso para se cadastrar.');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password, {
        nome,
        endereco_cidade: cidade,
        endereco_bairro: bairro,
        bio: endereco
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success('Cadastro realizado! Confirme seu email para ativar sua conta.');
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Criar uma conta</CardTitle>
        <p className="text-sm text-muted-foreground">
          Preencha o formulário abaixo para se cadastrar.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            placeholder="Digite seu nome completo"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Digite seu email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="Digite sua senha"
              type={mostrarSenha ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <Separator />
        <div className="grid gap-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            placeholder="Digite seu telefone"
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Select onValueChange={setCidade} defaultValue={cidade}>
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
        <div className="grid gap-2">
          <Label htmlFor="bairro">Bairro</Label>
          <Select onValueChange={setBairro} defaultValue={bairro}>
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
        <div className="grid gap-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input
            id="endereco"
            placeholder="Digite seu endereço"
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termosAceitos}
            onCheckedChange={(checked) => setTermosAceitos(checked === true)}
          />
          <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Aceito os <a href="/terms" className="underline">termos de uso</a>
          </Label>
        </div>
        <Button disabled={loading} onClick={handleSubmit}>
          {loading ? 'Cadastrando...' : 'Criar conta'}
        </Button>
      </CardContent>
    </Card>
  );
};
