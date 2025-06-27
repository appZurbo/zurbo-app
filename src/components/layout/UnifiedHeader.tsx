
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Settings, Shield, MessageCircle, Wrench, Bell, BellOff, Home, Users, Crown } from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/useMobile';

export const UnifiedHeader = () => {
  const { user, profile, logout, isAuthenticated, isAdmin, isPrestador } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const [isOnDuty, setIsOnDuty] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleOnDutyToggle = (checked: boolean) => {
    setIsOnDuty(checked);
    
    if (checked) {
      toast({
        title: "Você está Em Serviço!",
        description: "Agora você receberá notificações de pedidos emergenciais.",
      });
    } else {
      toast({
        title: "Você saiu de serviço",
        description: "Você não receberá mais notificações emergenciais.",
      });
    }
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

  const mobileShortcuts = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Users, label: 'Prestadores', path: '/prestadores' },
    { icon: Crown, label: 'Planos', path: '/planos' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">Z</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Zurbo</span>
        </div>

        {/* Mobile shortcuts */}
        {isMobile && (
          <div className="flex items-center gap-1">
            {mobileShortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <Button
                  key={shortcut.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(shortcut.path)}
                  className={`p-2 ${isActive(shortcut.path) ? 'text-orange-500 bg-orange-50' : 'text-gray-600'}`}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Trabalhe Conosco Button - Desktop only */}
          {!isMobile && (
            <Button
              onClick={() => navigate('/trabalhe-conosco')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Trabalhe Conosco
            </Button>
          )}

          {isAuthenticated ? (
            <>
              {/* Messages Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/conversas')}
                className="relative"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>

              {/* Notifications Bell */}
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                      <AvatarFallback>
                        {profile?.nome?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile?.nome}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs w-fit ${getUserTypeColor(profile?.tipo || 'cliente')} flex items-center gap-1`}
                      >
                        {getUserTypeIcon(profile?.tipo || 'cliente')}
                        {getUserTypeLabel(profile?.tipo || 'cliente')}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {/* Toggle Em Serviço para prestadores */}
                  {isPrestador && (
                    <>
                      <div className="flex items-center justify-between px-2 py-2">
                        <div className="flex items-center gap-2">
                          {isOnDuty ? (
                            <Bell className="h-4 w-4 text-green-500" />
                          ) : (
                            <BellOff className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">Em Serviço</span>
                        </div>
                        <Switch
                          checked={isOnDuty}
                          onCheckedChange={handleOnDutyToggle}
                        />
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                    <User className="mr-2 h-4 w-4" />
                    {isPrestador ? 'Configurações do Prestador' : 'Perfil'}
                  </DropdownMenuItem>
                  
                  {isPrestador && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/prestador-dashboard')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Painel do Prestador
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/agenda-prestador')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Minha Agenda
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {!isPrestador && !isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/pedidos')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Meus Agendamentos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/favoritos')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Prestadores Favoritos
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        Painel Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/moderacao')}>
                        <Shield className="mr-2 h-4 w-4" />
                        Moderação
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/sistema')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações do Sistema
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/relatorios')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Relatórios e Analytics
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Entrar
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
