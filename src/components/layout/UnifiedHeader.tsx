
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  LogOut, 
  Bell,
  Home,
  Users,
  Crown,
  MessageCircle,
  Calendar,
  BarChart3,
  Shield,
  Wrench,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';

export const UnifiedHeader = () => {
  const navigate = useNavigate();
  const { profile, isAuthenticated, logout, isPrestador, isAdmin } = useAuth();
  const isMobile = useMobile();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handlePremiumClick = () => {
    if (profile?.premium) {
      navigate('/premium-overview');
    } else {
      navigate('/planos');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Zurbo
              </span>
            </button>
          </div>

          {/* Desktop Navigation - Only show on desktop */}
          {!isMobile && (
            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-orange-500"
              >
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/prestadores')}
                className="text-gray-600 hover:text-orange-500"
              >
                <Users className="h-4 w-4 mr-2" />
                Prestadores
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/trabalhe-conosco')}
                className="text-gray-600 hover:text-orange-500"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Trabalhe Conosco
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/planos')}
                className="text-gray-600 hover:text-orange-500"
              >
                <Crown className="h-4 w-4 mr-2" />
                Planos
              </Button>
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Premium Crown for non-premium users */}
                {!profile?.premium && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePremiumClick}
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                  >
                    <Crown className="h-4 w-4" />
                    {!isMobile && <span className="ml-1">Premium</span>}
                  </Button>
                )}

                {/* Chat Icon - Desktop only */}
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/conversas')}
                    className="relative"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                      2
                    </Badge>
                  </Button>
                )}

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/notificacoes')}
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                        <AvatarFallback className="bg-orange-100 text-orange-600">
                          {profile?.nome?.charAt(0)?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{profile?.nome}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {profile?.email}
                        </p>
                        {/* User Type Badge */}
                        <div className="flex gap-1 mt-1">
                          {isAdmin && (
                            <Badge variant="destructive" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          {isPrestador && (
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                              <Wrench className="h-3 w-3 mr-1" />
                              Prestador
                            </Badge>
                          )}
                          {profile?.premium && (
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />

                    {/* Provider-specific options */}
                    {isPrestador && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/prestador-settings')}>
                          <Settings className="mr-2 h-4 w-4" />
                          Configurações do Prestador
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/agenda-prestador')}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Agenda
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/prestador-dashboard')}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Painel do Prestador
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Client-specific options */}
                    {!isPrestador && !isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                        <User className="mr-2 h-4 w-4" />
                        Configurações de Perfil
                      </DropdownMenuItem>
                    )}

                    {/* Admin-specific options */}
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                          <User className="mr-2 h-4 w-4" />
                          Configurações de Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/moderacao')}>
                          <Shield className="mr-2 h-4 w-4" />
                          Painel de Moderação
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Common options for all users */}
                    <DropdownMenuItem onClick={() => navigate('/pedidos')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Pedidos
                    </DropdownMenuItem>

                    {/* Premium options */}
                    <DropdownMenuItem onClick={handlePremiumClick}>
                      <Crown className="mr-2 h-4 w-4" />
                      {profile?.premium ? 'Meu Premium' : 'Upgrade Premium'}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {/* Premium button for non-authenticated users */}
                <Button
                  variant="ghost"
                  onClick={() => navigate('/planos')}
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  <Crown className="h-4 w-4" />
                  {!isMobile && <span className="ml-1">Premium</span>}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                  className="text-gray-600 hover:text-orange-500"
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
