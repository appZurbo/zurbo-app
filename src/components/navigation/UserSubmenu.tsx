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
  Wrench,
  Heart,
  Users,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnDutyStatus } from '@/hooks/useOnDutyStatus';
import { Switch } from '@/components/ui/switch';
import { Activity } from 'lucide-react';

export const UserSubmenu = () => {
  const navigate = useNavigate();
  const { profile, isPrestador, isAdmin } = useAuth();
  const { isOnDuty, loading: onDutyLoading, toggleOnDuty, canToggle } = useOnDutyStatus();

  if (!profile) return null;

  const getSettingsPath = () => {
    return isPrestador ? '/workersettings' : '/clientsettings';
  };

  const getUserTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'prestador':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cliente':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getUserTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'admin':
        return 'Administrador';
      case 'prestador':
        return 'Prestador';
      case 'cliente':
        return 'Cliente';
      default:
        return 'Cliente';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`flex items-center gap-2 ${isPrestador && isOnDuty ? 'ring-2 ring-orange-500 bg-orange-50 hover:bg-orange-100' : ''}`}>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{profile.nome}</span>
              {isPrestador && isOnDuty && (
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              )}
            </div>
            <Badge 
              variant="secondary" 
              className={`text-xs ${getUserTypeColor(profile.tipo)} flex items-center gap-1`}
            >
              {getUserTypeIcon(profile.tipo)}
              {getUserTypeLabel(profile.tipo)}
            </Badge>
          </div>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Configurações unificadas para todos */}
        <DropdownMenuItem onClick={() => navigate(getSettingsPath())}>
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </DropdownMenuItem>

        {isPrestador && (
          <>
            {canToggle && (
              <div className="px-2 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className={`h-4 w-4 ${isOnDuty ? 'text-orange-500' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">Em Serviço</span>
                  </div>
                  <Switch
                    checked={isOnDuty}
                    onCheckedChange={toggleOnDuty}
                    disabled={onDutyLoading}
                    className="scale-75"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 pl-6">
                  {isOnDuty ? 'Recebendo chamados SOS' : 'Não está disponível'}
                </p>
              </div>
            )}
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Painel do Prestador
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/agenda')}>
              <Calendar className="h-4 w-4 mr-2" />
              Agenda Profissional
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
              <Heart className="h-4 w-4 mr-2" />
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
            <DropdownMenuItem onClick={() => navigate('/admin/relatorios')}>
              <FileText className="h-4 w-4 mr-2" />
              Painel Administrativo
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/admin/usuarios')}>
              <Users className="h-4 w-4 mr-2" />
              Gerenciar Usuários
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/admin/moderacao')}>
              <Shield className="h-4 w-4 mr-2" />
              Moderação de Conteúdo
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
