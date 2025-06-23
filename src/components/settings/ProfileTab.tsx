
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';

export const ProfileTab = () => {
  const { profile } = useAuth();
  const isMobile = useMobile();

  return (
    <Card className={`${isMobile ? 'shadow-sm' : ''}`}>
      <CardHeader>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>
          Informações do Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          <div>
            <Label className="font-medium">Nome</Label>
            <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">{profile?.nome}</p>
          </div>
          <div>
            <Label className="font-medium">Email</Label>
            <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">{profile?.email}</p>
          </div>
          <div>
            <Label className="font-medium">Tipo de Conta</Label>
            <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded capitalize">{profile?.tipo}</p>
          </div>
          <div>
            <Label className="font-medium">Membro desde</Label>
            <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">
              {profile?.criado_em ? new Date(profile.criado_em).toLocaleDateString('pt-BR') : 'N/A'}
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            Para editar informações do perfil
          </p>
          <Button 
            onClick={() => window.location.href = '/perfil'}
            className={`${isMobile ? 'w-full' : ''}`}
          >
            Editar Perfil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
