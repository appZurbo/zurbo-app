
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
      const { error } = await supabase
        .from('users')
        .update({ em_servico: checked } as any)
        .eq('id', profile.id);
      
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
          <div className="flex items-center">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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
              <Button variant="ghost" onClick={() => navigate('/')} className="text-gray-600 hover:text-orange-500">
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>
              <Button variant="ghost" onClick={() => navigate('/prestadores')} className="text-gray-600 hover:text-orange-500">
                <Users className="h-4 w-4 mr-2" />
                Prestadores
              </Button>
              {isAuthenticated && (
                <Button variant="ghost" onClick={() => navigate('/ads')} className="text-gray-600 hover:text-orange-500">
                  <Newspaper className="h-4 w-4 mr-2" />
                  Anúncios
                </Button>
              )}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* PRO Button for Non-Premium Users */}
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
                        <span className="font-medium">PRO</span>
                      </>
                    )}
                  </Button>
                )}

                {/* Chat Icon - Desktop Only */}
                {!isMobile && (
                  <Button variant="ghost" size="sm" onClick={() => navigate('/conversas')} className="relative">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="sm" onClick={() => navigate('/notificacoes')} className="relative">
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
                      {isAdmin && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Shield className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-64 bg-white shadow-xl border border-gray-200 rounded-lg z-[100]" 
                    align="end" 
                    forceMount
                    sideOffset={8}
                  >
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                        <AvatarFallback className="bg-orange-100 text-orange-600">
                          {profile?.nome?.charAt(0)?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{profile?.nome}</p>
                        <p className="text-sm text-gray-500 truncate">{profile?.email}</p>
                        {isPremium && (
                          <Badge className="mt-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            {getPremiumLabel()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Provider Service Toggle */}
                    {isPrestador && (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${emServico ? 'bg-green-500' : 'bg-gray-400'}`} />
                              <Label htmlFor="em-servico" className="text-sm font-medium text-gray-700">
                                Em Serviço
                              </Label>
                            </div>
                            <Switch 
                              id="em-servico" 
                              checked={emServico} 
                              onCheckedChange={handleServiceToggle}
                              className="data-[state=checked]:bg-orange-500"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Provider Menu Items */}
                    {isPrestador && (
                      <div className="py-2">
                        <DropdownMenuItem onClick={() => navigate('/prestador-settings')} className="px-4 py-2 text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <Wrench className="mr-3 h-4 w-4 text-gray-500" />
                          <span>Configurações do Prestador</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/agenda')} className="px-4 py-2 text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <Calendar className="mr-3 h-4 w-4 text-gray-500" />
                          <span>Agenda</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/prestador-dashboard')} className="px-4 py-2 text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <BarChart3 className="mr-3 h-4 w-4 text-gray-500" />
                          <span>Painel do Prestador</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/pedidos')} className="px-4 py-2 text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <ShoppingBag className="mr-3 h-4 w-4 text-gray-500" />
                          <span>Pedidos</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(isPremium ? '/premium-dashboard' : '/planos')} className="px-4 py-2 text-yellow-600 hover:bg-yellow-50 focus:bg-yellow-50">
                          <Crown className="mr-3 h-4 w-4 text-yellow-600" />
                          <span>{isPremium ? 'Dashboard PRO' : 'Tornar-se Premium'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2 bg-gray-100" />
                        <DropdownMenuItem onClick={handleLogout} className="px-4 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50">
                          <LogOut className="mr-3 h-4 w-4 text-red-600" />
                          <span>Sair</span>
                        </DropdownMenuItem>
                      </div>
                    )}

                    {/* Client Menu Items */}
                    {!isPrestador && !isAdmin && (
                      <div className="py-2">
                        <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="px-4 py-2 text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <User className="mr-3 h-4 w-4 text-gray-500" />
                          <span>Meu Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/favoritos')} className="px-4 py-2 text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <Heart className="mr-3 h-4 w-4 text-gray-500" />
                          <span>Favoritos</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/pedidos')} className="px-4 py-2 text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <ShoppingBag className="mr-3 h-4 w-4 text-gray-500" />
                          <span>Meus Pedidos</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/conversas')} className="px-4 py-2 text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <MessageCircle className="mr-3 h-4 w-4 text-gray-500" />
                          <span>Conversas</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/enderecos')} className="px-4 py-2 text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <MapPin className="mr-3 h-4 w-4 text-gray-500" />
                          <span>Endereços</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/notificacoes')} className="px-4 py-2 text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <Bell className="mr-3 h-4 w-4 text-gray-500" />
                          <span>Notificações</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(isPremium ? '/premium-dashboard' : '/planos')} className="px-4 py-2 text-yellow-600 hover:bg-yellow-50 focus:bg-yellow-50">
                          <Crown className="mr-3 h-4 w-4 text-yellow-600" />
                          <span>{isPremium ? 'Dashboard PRO' : 'Tornar-se Premium'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2 bg-gray-100" />
                        <DropdownMenuItem onClick={handleLogout} className="px-4 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50">
                          <LogOut className="mr-3 h-4 w-4 text-red-600" />
                          <span>Sair</span>
                        </DropdownMenuItem>
                      </div>
                    )}

                    {/* Admin Menu Items */}
                    {isAdmin && (
                      <div className="py-2">
                        <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="px-4 py-2 text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <Settings className="mr-3 h-4 w-4 text-gray-500" />
                          <span>Configurações de Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/relatorios')} className="px-4 py-2 text-blue-600 hover:bg-blue-50 focus:bg-blue-50">
                          <BarChart3 className="mr-3 h-4 w-4 text-blue-600" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/moderacao')} className="px-4 py-2 text-blue-600 hover:bg-blue-50 focus:bg-blue-50">
                          <Shield className="mr-3 h-4 w-4 text-blue-600" />
                          <span>Painel de Moderação</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2 bg-gray-100" />
                        <DropdownMenuItem onClick={handleLogout} className="px-4 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50">
                          <LogOut className="mr-3 h-4 w-4 text-red-600" />
                          <span>Sair</span>
                        </DropdownMenuItem>
                      </div>
                    )}
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
                      <span className="font-medium">PRO</span>
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/auth')} className="text-gray-600 hover:text-orange-500">
                  Entrar
                </Button>
                <Button onClick={() => navigate('/auth')} className="bg-orange-500 hover:bg-orange-600">
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
