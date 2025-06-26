
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ChevronDown,
  Shield,
  Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const UserSubmenu = () => {
  const navigate = useNavigate();
  const { profile, isPrestador, isAdmin } = useAuth();

  if (!profile) return null;

  const getUserTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'prestador':
        return 'bg-orange-100 text-orange-800';
      case 'cliente':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'prestador':
        return <Wrench className="h-3 w-3" />;
      case 'cliente':
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{profile.nome}</span>
            </div>
            <Badge 
              variant="secondary" 
              size="sm"
              className={`text-xs ${getUserTypeColor(profile.tipo)} flex items-center gap-1`}
            >
              {getUserTypeIcon(profile.tipo)}
              {profile.tipo === 'admin' ? 'Administrador' : 
               profile.tipo === 'prestador' ? 'Prestador' : 'Cliente'}
            </Badge>
          </div>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
          <Settings className="h-4 w-4 mr-2" />
          {isPrestador ? 'Configurações do Prestador' : 'Perfil e Configurações'}
        </DropdownMenuItem>

        {isPrestador && (
          <>
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

        {!isPrestador && !isAdmin && (
          <>
            <DropdownMenuItem onClick={() => navigate('/pedidos')}>
              <Clock className="h-4 w-4 mr-2" />
              Meus Agendamentos
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/favoritos')}>
              <User className="h-4 w-4 mr-2" />
              Prestadores Favoritos
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem onClick={() => navigate('/notificacoes')}>
          <Bell className="h-4 w-4 mr-2" />
          Notificações
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              <Shield className="h-4 w-4 mr-2" />
              Painel Administrativo
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/admin/moderacao')}>
              <Shield className="h-4 w-4 mr-2" />
              Moderação de Conteúdo
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/admin/sistema')}>
              <Settings className="h-4 w-4 mr-2" />
              Configurações do Sistema
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
