
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Shield, MessageCircle, Wrench } from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ChatWindow } from '@/components/chat/ChatWindow';

export const ModernHeader = () => {
  const { user, profile, logout, isAuthenticated, isAdmin, isPrestador } = useAuth();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
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

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setChatOpen(!chatOpen)}
                  className="relative"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>

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

      <ChatWindow isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};
