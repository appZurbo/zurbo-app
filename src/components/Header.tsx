
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
  Bell,
  Wrench,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import AuthModal from './AuthModal';
import { NotificationBell } from './notifications/NotificationBell';

const Header = () => {
  const { user, profile, logout, isPrestador } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = (userData: any) => {
    console.log('Login realizado:', userData);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const handleSettingsClick = () => {
    navigate('/configuracoes');
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="ml-2 text-xl font-bold gradient-bg bg-clip-text text-transparent">
                ZURBO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-500 transition-colors">
                Início
              </Link>
              <Link to="/prestadores" className="text-gray-700 hover:text-orange-500 transition-colors">
                Prestadores
              </Link>
              <Link to="/como-funciona" className="text-gray-700 hover:text-orange-500 transition-colors">
                Como Funciona
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <NotificationBell />
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
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleProfileClick}>
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSettingsClick}>
                        <Settings className="mr-2 h-4 w-4" />
                        {isPrestador ? 'Configurações do Prestador' : 'Configurações'}
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
                  <Button variant="ghost" onClick={() => setShowAuthModal(true)}>
                    Entrar
                  </Button>
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    className="gradient-bg"
                  >
                    Cadastrar
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-orange-500 transition-colors px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Início
                </Link>
                <Link 
                  to="/prestadores" 
                  className="text-gray-700 hover:text-orange-500 transition-colors px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Prestadores
                </Link>
                <Link 
                  to="/como-funciona" 
                  className="text-gray-700 hover:text-orange-500 transition-colors px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Como Funciona
                </Link>
                
                {user ? (
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2 px-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                        <AvatarFallback>
                          {profile?.nome?.charAt(0) || user.email?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{profile?.nome || 'Usuário'}</p>
                        {isPrestador && (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                            <Wrench className="h-3 w-3" />
                            Prestador
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="justify-start px-2" 
                      onClick={() => {
                        handleProfileClick();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start px-2" 
                      onClick={() => {
                        handleSettingsClick();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {isPrestador ? 'Configurações do Prestador' : 'Configurações'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start px-2" 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Entrar
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="gradient-bg"
                    >
                      Cadastrar
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

export default Header;
