
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { 
  User, Settings, LogOut, Bell, Home, Users, Crown, MessageCircle, 
  Calendar, BarChart3, Shield, Menu, X, Wrench, Newspaper, Heart 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile, useTablet } from '@/hooks/useMobile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const ResponsiveHeader = () => {
  const navigate = useNavigate();
  const { profile, isAuthenticated, logout, isAdmin, isPrestador } = useAuth();
  const isMobile = useMobile();
  const isTablet = useTablet();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emServico, setEmServico] = useState(profile?.em_servico ?? true);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
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

  const navigationItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Users, label: 'Prestadores', path: '/prestadores' },
    { icon: Newspaper, label: 'Como Funciona', path: '/como-funciona' },
  ];

  const userMenuItems = [
    ...(isPrestador ? [
      { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
      { icon: Calendar, label: 'Agenda', path: '/agenda' },
    ] : []),
    { icon: User, label: 'Perfil', path: '/settings' },
    { icon: Heart, label: 'Favoritos', path: '/favoritos' },
    ...(isAdmin ? [{ icon: Shield, label: 'Admin', path: '/admin' }] : []),
  ];

  const isPremium = profile?.premium || false;

  // Mobile Menu Component
  const MobileMenu = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size={isMobile ? "touch" : "default"} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          {/* Header do menu */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">Zurbo</h2>
                {profile && (
                  <p className="text-sm text-gray-600 capitalize">{profile.tipo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Service Toggle para prestadores */}
          {isPrestador && (
            <div className="flex items-center justify-between py-4 border-b">
              <Label htmlFor="service-toggle-mobile" className="text-sm font-medium">
                {emServico ? 'Em serviço' : 'Fora de serviço'}
              </Label>
              <Switch
                id="service-toggle-mobile"
                checked={emServico}
                onCheckedChange={handleServiceToggle}
              />
            </div>
          )}

          {/* Navegação */}
          <nav className="flex-1 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start h-12"
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              ))}
              
              {isAuthenticated && (
                <>
                  <div className="border-t my-4"></div>
                  {userMenuItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className="w-full justify-start h-12"
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  ))}
                </>
              )}
            </div>
          </nav>

          {/* Footer com ações */}
          <div className="border-t pt-4">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sair
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigate('/auth');
                    setMobileMenuOpen(false);
                  }}
                >
                  Entrar
                </Button>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    navigate('/auth');
                    setMobileMenuOpen(false);
                  }}
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40">
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className="text-gray-700 hover:text-orange-600"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Menu */}
            <MobileMenu />

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <Button
                  variant="ghost"
                  size={isMobile ? "icon-touch" : "icon"}
                  onClick={() => navigate('/notificacoes')}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500 text-white">
                    2
                  </Badge>
                </Button>

                {/* Service Toggle (Desktop/Tablet only) */}
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

                {/* User Avatar Menu (Desktop only) */}
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                          <AvatarFallback className="bg-orange-100 text-orange-600">
                            {profile?.nome?.charAt(0)?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-sm">{profile?.nome}</p>
                          <p className="text-xs text-muted-foreground">{profile?.email}</p>
                          {isPremium && (
                            <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700">
                              <Crown className="h-3 w-3 mr-1" />
                              PRO
                            </Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      
                      {userMenuItems.map((item) => (
                        <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size={isMobile ? "touch" : "default"}
                  onClick={() => navigate('/auth')}
                  className="text-gray-700 hover:text-orange-600"
                >
                  Entrar
                </Button>
                <Button
                  size={isMobile ? "touch" : "default"}
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
