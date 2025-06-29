
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageCircle, Settings, User, LogOut, Shield, Calendar, FileText, Crown, Heart, AlertTriangle, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { useMobile } from '@/hooks/useMobile';

export const UnifiedHeader = () => {
  const { profile, logout, isAdmin, isPrestador } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const getSOSLimit = () => profile?.premium ? 7 : 3;

  const UserDropdownMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
            <AvatarFallback className="bg-orange-500 text-white">
              {profile?.nome?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
            <AvatarFallback className="bg-orange-500 text-white">
              {profile?.nome?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.nome}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {/* Client Menu Items */}
        {profile?.tipo === 'cliente' && (
          <>
            <DropdownMenuItem onClick={() => handleNavigation('/conversas')}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Minhas Conversas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/pedidos')}>
              <FileText className="mr-2 h-4 w-4" />
              Meus Pedidos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/favoritos')}>
              <Heart className="mr-2 h-4 w-4" />
              Favoritos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/notificacoes')}>
              <Bell className="mr-2 h-4 w-4" />
              Notificações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigation('/planos')}>
              <Crown className="mr-2 h-4 w-4" />
              Planos Premium
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => handleNavigation('/emergency')}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              SOS ({getSOSLimit()} restantes)
            </DropdownMenuItem>
          </>
        )}

        {/* Provider Menu Items */}
        {isPrestador && (
          <>
            <DropdownMenuItem onClick={() => handleNavigation('/prestador-dashboard')}>
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/conversas')}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Conversas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/agenda-prestador')}>
              <Calendar className="mr-2 h-4 w-4" />
              Minha Agenda
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/pedidos')}>
              <FileText className="mr-2 h-4 w-4" />
              Pedidos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigation('/premium-overview')}>
              <Crown className="mr-2 h-4 w-4" />
              {profile?.premium ? 'Premium Ativo' : 'Upgrade Premium'}
              {profile?.premium && <Badge variant="secondary" className="ml-2">Pro</Badge>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/prestador-settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
          </>
        )}

        {/* Admin Menu Items */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigation('/admin')}>
              <Shield className="mr-2 h-4 w-4" />
              Painel Admin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/admin/relatorios')}>
              <FileText className="mr-2 h-4 w-4" />
              Relatórios
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/admin/moderacao')}>
              <Shield className="mr-2 h-4 w-4" />
              Moderação
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleNavigation('/configuracoes')}>
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <span className="font-bold text-xl text-gray-900">Zurbo</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
              Início
            </Link>
            <Link to="/prestadores" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
              Prestadores
            </Link>
            {profile && (
              <Link to="/conversas" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
                Conversas
              </Link>
            )}
          </nav>
        )}

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {profile ? (
            <>
              <NotificationBell />
              <UserDropdownMenu />
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Entrar
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Cadastrar
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-4 space-y-2">
            <Link 
              to="/" 
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/prestadores" 
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Prestadores
            </Link>
            {profile && (
              <Link 
                to="/conversas" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Conversas
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
