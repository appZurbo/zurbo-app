
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Eye, EyeOff, User, UserCheck, AlertTriangle } from 'lucide-react';

interface SimulationModeProps {
  onSimulationChange: (isSimulating: boolean, simulatedRole?: string) => void;
}

export const SimulationMode = ({ onSimulationChange }: SimulationModeProps) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState('cliente');
  const [isOpen, setIsOpen] = useState(false);

  const roleOptions = [
    { value: 'cliente', label: 'Cliente', icon: User },
    { value: 'prestador', label: 'Prestador', icon: UserCheck },
  ];

  const handleStartSimulation = () => {
    setIsSimulating(true);
    onSimulationChange(true, simulatedRole);
    setIsOpen(false);
    toast.success(`Modo simulação ativado - ${roleOptions.find(r => r.value === simulatedRole)?.label}`);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
    onSimulationChange(false);
    toast.success("Modo simulação desativado - Voltou à visualização de administrador");
  };

  if (isSimulating) {
    return (
      <div className="flex items-center gap-3">
        <Alert className="bg-orange-50 border-orange-200">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between w-full">
              <span>
                Modo simulação ativo: 
                <Badge className="ml-2 bg-orange-100 text-orange-800">
                  {roleOptions.find(r => r.value === simulatedRole)?.label}
                </Badge>
              </span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleStopSimulation}
                className="ml-4"
              >
                <EyeOff className="h-4 w-4 mr-1" />
                Sair da Simulação
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Simular Como Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modo de Simulação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              O modo simulação permite que você veja a plataforma do ponto de vista de diferentes tipos de usuário, sem afetar dados reais.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Simular como:</label>
            <Select value={simulatedRole} onValueChange={setSimulatedRole}>
              <SelectTrigger>
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
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleStartSimulation}>
              <Eye className="h-4 w-4 mr-2" />
              Iniciar Simulação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
