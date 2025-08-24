
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, UserX, Crown, Shield, User } from 'lucide-react';

import { UserRoleManagerProps } from '@/types';

export const UserRoleManager = ({ userId, currentRole, userName, onRoleUpdate }: UserRoleManagerProps) => {
  const [newRole, setNewRole] = useState(currentRole);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const roleOptions = [
    { value: 'cliente', label: 'Cliente', icon: User, color: 'bg-blue-100 text-blue-800' },
    { value: 'prestador', label: 'Prestador', icon: UserCheck, color: 'bg-green-100 text-green-800' },
    { value: 'moderator', label: 'Moderador', icon: Shield, color: 'bg-purple-100 text-purple-800' },
    { value: 'admin', label: 'Admin', icon: Crown, color: 'bg-red-100 text-red-800' },
  ];

  const getCurrentRoleInfo = () => {
    return roleOptions.find(role => role.value === currentRole) || roleOptions[0];
  };

  const handleRoleUpdate = async () => {
    if (newRole === currentRole) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ tipo: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Cargo atualizado - ${userName} agora é ${roleOptions.find(r => r.value === newRole)?.label}`);

      onRoleUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar cargo:', error);
      toast.error("Não foi possível atualizar o cargo do usuário");
    } finally {
      setIsUpdating(false);
    }
  };

  const CurrentRoleIcon = getCurrentRoleInfo().icon;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <CurrentRoleIcon className="h-3 w-3" />
          <Badge className={getCurrentRoleInfo().color}>
            {getCurrentRoleInfo().label}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Cargo do Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Alterando cargo de: <strong>{userName}</strong>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Novo cargo:</label>
            <Select value={newRole} onValueChange={setNewRole}>
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
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleRoleUpdate}
              disabled={isUpdating || newRole === currentRole}
            >
              {isUpdating ? 'Atualizando...' : 'Atualizar Cargo'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
