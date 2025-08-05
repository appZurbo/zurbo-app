
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, UserCheck, Shield } from 'lucide-react';

interface AdminViewToggleProps {
  onSimulationChange: (isSimulating: boolean, simulatedRole?: 'cliente' | 'prestador') => void;
}

export const AdminViewToggle = ({ onSimulationChange }: AdminViewToggleProps) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState<'cliente' | 'prestador'>('cliente');

  const roleOptions = [
    { value: 'cliente', label: 'Cliente', icon: User },
    { value: 'prestador', label: 'Prestador', icon: UserCheck },
  ];

  const handleStartSimulation = () => {
    setIsSimulating(true);
    onSimulationChange(true, simulatedRole);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
    onSimulationChange(false);
  };

  if (isSimulating) {
    return (
      <Alert className="bg-orange-50 border-orange-200">
        <Eye className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              Simulando como: 
              <Badge className="bg-orange-100 text-orange-800">
                {roleOptions.find(r => r.value === simulatedRole)?.label}
              </Badge>
            </span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleStopSimulation}
              className="ml-4"
            >
              <Shield className="h-4 w-4 mr-1" />
              Voltar ao Admin
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-blue-600" />
        <span className="font-medium">Modo Admin</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={simulatedRole} onValueChange={(value) => setSimulatedRole(value as 'cliente' | 'prestador')}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((role) => {
              const IconComponent = role.icon;
              return (
                <SelectItem key={role.value} value={role.value}>
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    {role.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Button onClick={handleStartSimulation} size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Simular Como
        </Button>
      </div>
    </div>
  );
};
