
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, CreditCard, Calendar, Wrench } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const ProviderProfileSection = () => {
  const { profile } = useAuth();

  if (!profile) {
    return <div className="text-center py-4">Carregando dados do prestador...</div>;
  }

  const formatCPF = (cpf: string) => {
    if (!cpf) return 'Não informado';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-orange-500" />
          Dados do Prestador de Serviços
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture and Basic Info */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="w-24 h-24 border-4 border-orange-100">
              <AvatarImage src={profile.foto_url} alt={profile.nome} />
              <AvatarFallback className="text-xl bg-orange-100 text-orange-600">
                {profile.nome?.charAt(0)?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
              <Wrench className="h-3 w-3 mr-1" />
              Prestador Ativo
            </Badge>
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{profile.nome}</h3>
              <p className="text-gray-600">{profile.bio || 'Nenhuma descrição adicionada'}</p>
            </div>
          </div>
        </div>

        {/* Registration Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-sm font-medium text-gray-700">Nome Completo</Label>
              <p className="text-sm text-gray-900">{profile.nome || 'Não informado'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <p className="text-sm text-gray-900">{profile.email || 'Não informado'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CreditCard className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-sm font-medium text-gray-700">CPF</Label>
              <p className="text-sm text-gray-900 font-mono">
                {formatCPF(profile.cpf)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-sm font-medium text-gray-700">Telefone</Label>
              <p className="text-sm text-gray-900">{profile.telefone || 'Não informado'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-sm font-medium text-gray-700">Localização</Label>
              <p className="text-sm text-gray-900">
                {profile.endereco_cidade && profile.endereco_bairro 
                  ? `${profile.endereco_bairro}, ${profile.endereco_cidade}`
                  : 'Não informado'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-sm font-medium text-gray-700">Cadastro</Label>
              <p className="text-sm text-gray-900">
                {formatDate(profile.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Full Address */}
        {(profile.endereco_rua || profile.endereco_numero || profile.endereco_cep) && (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <Label className="text-sm font-medium text-orange-800 mb-2 block">
              <MapPin className="h-4 w-4 inline mr-1" />
              Endereço Completo
            </Label>
            <p className="text-sm text-orange-700">
              {[
                profile.endereco_rua,
                profile.endereco_numero,
                profile.endereco_bairro,
                profile.endereco_cidade,
                profile.endereco_cep
              ].filter(Boolean).join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
