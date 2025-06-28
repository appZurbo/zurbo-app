
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Bell, Home, Users, Crown, MessageCircle, Calendar, BarChart3, Shield, ShoppingBag, Wrench, Newspaper, Heart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const UnifiedHeader = () => {
  const navigate = useNavigate();
  const {
    profile,
    isAuthenticated,
    logout,
    isAdmin,
    isPrestador
  } = useAuth();
  const isMobile = useMobile();
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

  const getPremiumLabel = () => {
    if (!isPremium) return null;
    if (isPrestador) return "PRO - Prestador";
    if (isAdmin) return "PRO - Admin";
    return "PRO - Cliente";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-sm flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Zurbo</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-orange-600"
            >
              <Home className="h-4 w-4 mr-2" />
              Início
            </Button>
            
            {/* Dropdown Prestadores */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-orange-600"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Prestadores
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/prestadores')}>
                  <Users className="h-4 w-4 mr-2" />
                  Ver Prestadores
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/como-funciona')}>
                  <Newspaper className="h-4 w-4 mr-2" />
                  Como Funciona
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/trabalhe-conosco')}>
                  <Wrench className="h-4 w-4 mr-2" />
                  Seja um Prestador
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dropdown Clientes */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-orange-600"
                >
                  <User className="h-4 w-4 mr-2" />
                  Clientes
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/planos')}>
                  <Crown className="h-4 w-4 mr-2" />
                  Planos Premium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/central-ajuda')}>
                  <Shield className="h-4 w-4 mr-2" />
                  Central de Ajuda
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/sobre-nos')}>
                  <Heart className="h-4 w-4 mr-2" />
                  Sobre Nós
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              onClick={() => navigate('/conversas')}
              className="text-gray-700 hover:text-orange-600"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Conversas
            </Button>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/notificacoes')}
                  className="relative p-2"
                >
                  <Bell className="h-5 w-5" />
                </Button>

                {/* Service Toggle for Providers */}
                {isPrestador && (
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

                {/* User Menu */}
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
                            {getPremiumLabel()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {/* Mobile Service Toggle */}
                    {isPrestador && isMobile && (
                      <>
                        <div className="flex items-center justify-between px-2 py-2">
                          <Label htmlFor="mobile-service-toggle" className="text-sm">
                            {emServico ? 'Em serviço' : 'Fora de serviço'}
                          </Label>
                          <Switch
                            id="mobile-service-toggle"
                            checked={emServico}
                            onCheckedChange={handleServiceToggle}
                          />
                        </div>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/favoritos')}>
                      <Heart className="mr-2 h-4 w-4" />
                      Favoritos
                    </DropdownMenuItem>
                    
                    {isPrestador && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/prestador-dashboard')}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/agenda')}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Agenda
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        Administração
                      </DropdownMenuItem>
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
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                  className="text-gray-700 hover:text-orange-600"
                >
                  Entrar
                </Button>
                <Button
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
