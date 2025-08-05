
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Settings, Eye, EyeOff } from 'lucide-react';
import { useAuthSimulation } from '@/hooks/useAuthSimulation';

export const AdminViewToggle: React.FC = () => {
  const { 
    isSimulating, 
    simulatedUserType, 
    enableSimulation, 
    disableSimulation 
  } = useAuthSimulation();

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'cliente': return 'Cliente';
      case 'prestador': return 'Prestador';
      case 'admin': return 'Admin';
      default: return 'Usuário';
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'cliente': return User;
      case 'prestador': return Settings;
      case 'admin': return Eye;
      default: return User;
    }
  };

  if (isSimulating) {
    const Icon = getUserTypeIcon(simulatedUserType);
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Simulando como {getUserTypeLabel(simulatedUserType)}
              </span>
              <Badge variant="outline" className="bg-white text-orange-700 border-orange-300">
                Modo Teste
              </Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={disableSimulation}
              className="h-8 px-3 text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              <EyeOff className="h-3 w-3 mr-1" />
              Sair da Simulação
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Modo Administrador
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => enableSimulation('cliente')}
              className="h-8 px-3 text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <User className="h-3 w-3 mr-1" />
              Simular Cliente
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => enableSimulation('prestador')}
              className="h-8 px-3 text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <Settings className="h-3 w-3 mr-1" />
              Simular Prestador
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
