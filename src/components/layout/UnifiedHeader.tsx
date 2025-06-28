
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { 
  User, Settings, LogOut, Bell, Home, Users, Crown, MessageCircle, 
  Calendar, BarChart3, Shield, ShoppingBag, Heart, MapPin, HelpCircle,
  FileText, Clock
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile, useTablet } from '@/hooks/useMobile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export const UnifiedHeader = () => {
  const navigate = useNavigate();
  const {
    profile,
    user,
    isAuthenticated,
    logout,
    isAdmin,
    isPrestador
  } = useAuth();
  const isMobile = useMobile();
  const isTablet = useTablet();
  const { toast } = useToast();
  const [emServico, setEmServico] = useState(profile?.em_servico ?? true);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleServiceToggle = async (checked: boolean) => {
    if (!profile) return;
    try {
      const { error } = await supabase.from('users').update({
        em_servico: checked
      } as any).eq('id', profile.id);

      if (error) throw error;

      setEmServico(checked);
      toast({
        title: checked ? "Em serviço" : "Fora de serviço",
        description: checked ? "Você está disponível para novos pedidos" : "Você não receberá novos pedidos"
      });
    } catch (error) {
      console.error('Error updating service status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status de serviço",
        variant: "destructive"
      });
    }
  };

  const isPremium = profile?.premium || false;

  const renderNavigationButtons = () => {
    if (isMobile) return null; // Navigation handled by dock on mobile

    return (
      <nav className="hidden md:flex items-center space-x-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
        >
          <Home className="h-4 w-4" />
          Início
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => navigate('/prestadores')}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
        >
          <Users className="h-4 w-4" />
          Prestadores
        </Button>
        
        {isAuthenticated && (
          <Button
            variant="ghost"
            onClick={() => navigate('/conversas')}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
          >
            <MessageCircle className="h-4 w-4" />
            Conversas
          </Button>
        )}
      </nav>
    );
  };

  const renderUserDropdown = () => {
    if (!isAuthenticated) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
              <AvatarFallback className="bg-orange-100 text-orange-600">
                {profile?.nome?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            {isAdmin && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Shield className="h-2 w-2 text-white" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <div className="flex items-center gap-2">
                <p className="font-medium">{profile?.nome || 'Usuário'}</p>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    PRO
                  </Badge>
                )}
              </div>
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
              <Badge variant="secondary" className="w-fit text-xs">
                {isPrestador ? (
                  <>
                    <Users className="h-3 w-3 mr-1" />
                    Prestador
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3 mr-1" />
                    Cliente
                  </>
                )}
              </Badge>
            </div>
          </div>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => navigate(isPrestador ? '/prestador-settings' : '/configuracoes')}>
            <Settings className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => navigate('/pedidos')}>
            <Clock className="mr-2 h-4 w-4" />
            Pedidos
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/favoritos')}>
            <Heart className="mr-2 h-4 w-4" />
            Favoritos
          </DropdownMenuItem>

          {isPrestador ? (
            <>
              <DropdownMenuItem onClick={() => navigate('/agenda-prestador')}>
                <Calendar className="mr-2 h-4 w-4" />
                Agenda
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/prestador-dashboard')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Painel do Prestador
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => navigate('/central-ajuda')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Central de Ajuda
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/como-funciona')}>
                <FileText className="mr-2 h-4 w-4" />
                Como Funciona
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/regras-comunidade')}>
                <Shield className="mr-2 h-4 w-4" />
                Regras da Comunidade
              </DropdownMenuItem>
              
              {!isPremium && (
                <DropdownMenuItem onClick={() => navigate('/planos')}>
                  <Crown className="mr-2 h-4 w-4" />
                  Torne-se PRO
                </DropdownMenuItem>
              )}
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Zurbo
            </span>
          </Link>

          {/* Desktop/Tablet Navigation */}
          {renderNavigationButtons()}

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Service Toggle for Prestadores (Desktop/Tablet only) */}
            {isPrestador && !isMobile && (
              <div className="hidden sm:flex items-center space-x-2">
                <Switch
                  id="service-toggle"
                  checked={emServico}
                  onCheckedChange={handleServiceToggle}
                />
                <Label htmlFor="service-toggle" className="text-sm">
                  {emServico ? 'Em serviço' : 'Fora de serviço'}
                </Label>
              </div>
            )}

            {/* Notifications */}
            {isAuthenticated && <NotificationBell />}

            {/* PRO Button */}
            {!isPremium && (
              <Button
                variant="ghost"
                size={isMobile ? "icon" : "sm"}
                onClick={() => navigate('/planos')}
                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
              >
                <Crown className="h-5 w-5" />
                {!isMobile && <span className="ml-1">PRO</span>}
              </Button>
            )}

            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden lg:block">
                {renderUserDropdown()}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  onClick={() => navigate('/auth')}
                  className="text-gray-700 hover:text-orange-600"
                >
                  Entrar
                </Button>
                <Button
                  size={isMobile ? "sm" : "default"}
                  onClick={() => navigate('/auth')}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
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
