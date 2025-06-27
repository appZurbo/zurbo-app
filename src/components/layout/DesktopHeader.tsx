
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  User, 
  Settings, 
  LogOut, 
  Wrench,
  MessageCircle,
  Calendar,
  LayoutDashboard,
  FileText,
  Crown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useMobile } from '@/hooks/useMobile';

const DesktopHeader = () => {
  const { user, profile, logout, isPrestador } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMobile();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Não renderizar no mobile
  if (isMobile) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">
              ZURBO
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-500 transition-colors">
              Início
            </Link>
            <Link to="/prestadores" className="text-gray-700 hover:text-orange-500 transition-colors">
              Prestadores
            </Link>
            <Link to="/trabalhe-conosco" className="text-gray-700 hover:text-orange-500 transition-colors">
              Trabalhe Conosco
            </Link>
            <Link to="/planos" className="text-gray-700 hover:text-orange-500 transition-colors">
              Planos
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Conversations Button */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/conversas')}
                  className="relative"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    2
                  </span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                        <AvatarFallback>
                          {profile?.nome?.charAt(0) || user.email?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{profile?.nome || 'Usuário'}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        {isPrestador && (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            <Wrench className="h-3 w-3" />
                            Prestador
                          </span>
                        )}
                        {profile?.premium && (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                            <Crown className="h-3 w-3" />
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {/* Profile Settings */}
                    <DropdownMenuItem onClick={() => navigate(isPrestador ? '/prestador-settings' : '/configuracoes')}>
                      <User className="mr-2 h-4 w-4" />
                      {isPrestador ? 'Prestador Configurações' : 'Configurações de Perfil'}
                    </DropdownMenuItem>

                    {/* Agenda */}
                    <DropdownMenuItem onClick={() => navigate(isPrestador ? '/agenda-prestador' : '/pedidos')}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Agenda
                    </DropdownMenuItem>

                    {/* Dashboard (Prestadores only) */}
                    {isPrestador && (
                      <DropdownMenuItem onClick={() => navigate('/prestador-dashboard')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Painel do Prestador
                      </DropdownMenuItem>
                    )}

                    {/* Orders */}
                    <DropdownMenuItem onClick={() => navigate('/pedidos')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Pedidos
                    </DropdownMenuItem>

                    {/* Premium Settings */}
                    <DropdownMenuItem onClick={() => navigate('/planos')}>
                      <Crown className="mr-2 h-4 w-4" />
                      Premium
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
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/auth')}>
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

export default DesktopHeader;
