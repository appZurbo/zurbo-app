
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  User, 
  Settings, 
  Bell, 
  Clock, 
  Calendar,
  BarChart3,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const UserSubmenu = () => {
  const navigate = useNavigate();
  const { profile, isPrestador } = useAuth();

  if (!profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {profile.nome}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/notificacoes')}>
          <Bell className="h-4 w-4 mr-2" />
          Notificações
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate('/pedidos')}>
          <Clock className="h-4 w-4 mr-2" />
          Histórico de Pedidos
        </DropdownMenuItem>

        {isPrestador && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/prestador-dashboard')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Painel do Prestador
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/agenda-prestador')}>
              <Calendar className="h-4 w-4 mr-2" />
              Minha Agenda
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
