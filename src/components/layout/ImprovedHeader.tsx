
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Home,
  MessageCircle,
  Calendar,
  History,
  Wrench
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';

export const ImprovedHeader = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, logout, isAuthenticated, isPrestador } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (nome: string) => {
    return nome?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const menuItems = [
    { 
      label: 'Início', 
      href: '/', 
      icon: Home,
      show: true 
    },
    { 
      label: 'Conversas', 
      href: '/conversas', 
      icon: MessageCircle,
      show: isAuthenticated 
    },
    { 
      label: 'Pedidos', 
      href: '/pedidos', 
      icon: Calendar,
      show: isAuthenticated 
    },
    { 
      label: 'Configurações', 
      href: '/configuracoes', 
      icon: Settings,
      show: isAuthenticated 
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Zurbo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.filter(item => item.show).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search (Desktop) */}
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>

            {/* Notifications */}
            {isAuthenticated && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500">
                  2
                </Badge>
              </Button>
            )}

            {/* User Menu */}
            {isAuthenticated && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.foto_url} alt={profile.nome} />
                      <AvatarFallback className="bg-orange-500 text-white">
                        {getInitials(profile.nome)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.foto_url} alt={profile.nome} />
                      <AvatarFallback className="bg-orange-500 text-white text-xs">
                        {getInitials(profile.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile.nome}</p>
                      <p className="text-xs text-gray-500">{profile.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/conversas" className="flex items-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Conversas
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/pedidos" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Histórico de Pedidos
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/configuracoes" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>
                Entrar
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <Button variant="outline" className="justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar serviços
                  </Button>

                  {/* Navigation Links */}
                  {menuItems.filter(item => item.show).map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}

                  {isAuthenticated && (
                    <>
                      <div className="border-t pt-4 mt-4">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-5 w-5 mr-3" />
                          Sair
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
