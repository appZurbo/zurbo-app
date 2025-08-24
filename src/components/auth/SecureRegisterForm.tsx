
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthSecurity } from '@/hooks/useAuthSecurity';

interface SecureRegisterFormProps {
  onSuccess?: () => void;
}

export const SecureRegisterForm: React.FC<SecureRegisterFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [isProvider, setIsProvider] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { secureSignUp } = useAuthSecurity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error('Você precisa aceitar os termos de uso para se registrar.');
      return;
    }

    setLoading(true);
    try {
      const result = await secureSignUp(email, password, {
        nome: name,
        endereco_cidade: city,
        endereco_rua: address,
        tipo: isProvider ? 'prestador' : 'cliente',
        bio: '',
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Registro realizado! Confirme seu email para ativar sua conta.');
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro ao registrar.');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (checked: boolean | 'indeterminate') => {
    setIsProvider(checked === true);
  };

  const handleTermsChange = (checked: boolean | 'indeterminate') => {
    setTermsAccepted(checked === true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar uma conta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              type="text"
              id="name"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
            <Label htmlFor="phone">Telefone</Label>
            <Input
              type="tel"
              id="phone"
              placeholder="(99) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="city">Cidade</Label>
            <Input
              type="text"
              id="city"
              placeholder="Sua cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              type="text"
              id="address"
              placeholder="Seu endereço"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="isProvider">
              <div className="flex items-center">
                <Checkbox
                  id="isProvider"
                  checked={isProvider}
                  onCheckedChange={handleProviderChange}
                />
                <span className="ml-2">Quero me cadastrar como prestador de serviços</span>
              </div>
            </Label>
          </div>
          <div>
            <Label htmlFor="terms">
              <div className="flex items-center">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={handleTermsChange}
                  required
                />
                <span className="ml-2">
                  Eu aceito os <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-500">termos de uso</a> e a <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500">política de privacidade</a>
                </span>
              </div>
            </Label>
          </div>
          <Button disabled={loading} className="w-full">
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
