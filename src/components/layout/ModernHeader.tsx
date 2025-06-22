
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut, 
  Crown,
  Menu,
  X,
  Bell,
  Heart,
  Shield
} from 'lucide-react';

export const ModernHeader = () => {
  const { profile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const handleSettingsClick = () => {
    navigate('/configuracoes');
  };

  const handlePremiumClick = () => {
    navigate('/premium');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleServicesClick = () => {
    if (profile?.tipo === 'prestador') {
      navigate('/servicos');
    } else {
      scrollToSection('servicos');
    }
  };

  // Verificar se o usuário é admin ou moderator
  const isAdminOrModerator = profile?.tipo === 'admin' || profile?.tipo === 'moderator';

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={handleLogoClick}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Zurbo
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Conectando talentos</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={handleServicesClick}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Como funciona
            </button>
            <button
              onClick={handlePremiumClick}
              className="text-gray-700 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              <Crown className="h-4 w-4 text-yellow-500" />
              Premium
            </button>
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated && profile ? (
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-50">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile.foto_url} alt={profile.nome} />
                        <AvatarFallback className="bg-orange-500 text-white">
                          {profile.nome.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-900">
                            {profile.nome}
                          </span>
                          {profile.premium && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 capitalize">
                          {profile.tipo}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="font-medium">{profile.nome}</p>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                      {profile.premium && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white mt-1">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    
                    <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
                      <User className="h-4 w-4 mr-2" />
                      Meu Perfil
                    </DropdownMenuItem>
                    
                    {profile.tipo === 'prestador' && (
                      <DropdownMenuItem className="cursor-pointer" onClick={handleServicesClick}>
                        <Heart className="h-4 w-4 mr-2" />
                        Meus Serviços
                      </DropdownMenuItem>
                    )}
                    
                    {isAdminOrModerator && (
                      <DropdownMenuItem className="cursor-pointer" onClick={handleAdminClick}>
                        <Shield className="h-4 w-4 mr-2" />
                        Painel Admin
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem className="cursor-pointer" onClick={handleSettingsClick}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </DropdownMenuItem>
                    
                    {!profile.premium && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={handlePremiumClick}>
                          <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                          <span className="text-yellow-600 font-medium">Upgrade para Premium</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleAuthClick}>
                  Entrar
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={handleAuthClick}>
                  Cadastrar
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="space-y-2">
              <button
                onClick={handleServicesClick}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                Serviços
              </button>
              <button
                onClick={() => scrollToSection('como-funciona')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                Como funciona
              </button>
              <button
                onClick={handlePremiumClick}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
              >
                <Crown className="h-4 w-4 text-yellow-500" />
                Premium
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
