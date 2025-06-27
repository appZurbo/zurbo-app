
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  ShoppingBag,
  Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const UnifiedHeader = () => {
  const navigate = useNavigate();
  const { profile, isAuthenticated, logout, isAdmin, isPrestador } = useAuth();
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
      const { error } = await supabase
        .from('users')
        .update({ em_servico: checked })
        .eq('id', profile.id);

      if (error) throw error;
      
      setEmServico(checked);
      toast({
        title: checked ? "Em serviço" : "Fora de serviço",
        description: checked ? "Você está disponível para novos pedidos" : "Você não receberá novos pedidos",
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
    if (isPrestador) return "Premium - Prestador";
    if (isAdmin) return "Premium - Admin";
    return "Premium - Cliente";
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

          {/* Desktop Navigation */}
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
                {/* Premium Button for Non-Premium Users */}
                {!isPremium && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/planos')}
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                  >
                    {isMobile ? (
                      <Crown className="h-4 w-4" />
                    ) : (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        <span className="font-medium">Premium</span>
                      </>
                    )}
                  </Button>
                )}

                {/* Chat Icon - Desktop Only */}
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/conversas')}
                    className="relative"
                  >
                    <MessageCircle className="h-4 w-4" />
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
                        {isAdmin && (
                          <Badge className="w-fit bg-red-100 text-red-800 border-red-200">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {isPremium && (
                          <Badge className="w-fit bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Crown className="h-3 w-3 mr-1" />
                            {getPremiumLabel()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {/* Provider Menu Items */}
                    {isPrestador && (
                      <>
                        <div className="px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="em-servico"
                              checked={emServico}
                              onCheckedChange={handleServiceToggle}
                            />
                            <Label htmlFor="em-servico" className="text-sm">
                              Em Serviço
                            </Label>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/prestador-settings')}>
                          <Wrench className="mr-2 h-4 w-4" />
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

                    {/* Client Menu Items */}
                    {!isPrestador && !isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                        <User className="mr-2 h-4 w-4" />
                        Configurações de Perfil
                      </DropdownMenuItem>
                    )}

                    {/* Admin Menu Items */}
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                          <Settings className="mr-2 h-4 w-4" />
                          Configurações de Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/relatorios')}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/moderacao')}>
                          <Shield className="mr-2 h-4 w-4" />
                          Painel de Moderação
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Common Menu Items for All Users */}
                    <DropdownMenuItem onClick={() => navigate('/pedidos')}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Pedidos
                    </DropdownMenuItem>

                    {/* Premium Menu Item */}
                    <DropdownMenuItem onClick={() => navigate(isPremium ? '/premium-overview' : '/planos')}>
                      <Crown className="mr-2 h-4 w-4" />
                      {isPremium ? 'Visão Geral Premium' : 'Tornar-se Premium'}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/planos')}
                  className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                >
                  {isMobile ? (
                    <Crown className="h-4 w-4" />
                  ) : (
                    <>
                      <Crown className="h-4 w-4 mr-2" />
                      <span className="font-medium">Premium</span>
                    </>
                  )}
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
