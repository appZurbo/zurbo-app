
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
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
                  <DropdownMenuContent className="w-56 bg-white shadow-lg border z-[70] border-gray-200" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-gray-900">{profile?.nome}</p>
                        <p className="w-[200px] truncate text-sm text-gray-600">
                          {profile?.email}
                        </p>
                        {isAdmin && (
                          <Badge className="w-fit bg-red-100 text-red-800 border-red-200">
                            <Shield className="h-3 w-3 mr-1 text-red-800" />
                            Admin Verificado
                          </Badge>
                        )}
                        {isPremium && (
                          <Badge className="w-fit bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 shadow-lg" style={{
                            boxShadow: '0 0 10px rgba(251, 191, 36, 0.3)'
                          }}>
                            <Crown className="h-3 w-3 mr-1 text-white" />
                            {getPremiumLabel()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    
                    {/* Provider Menu Items */}
                    {isPrestador && (
                      <>
                        <div className="px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <Switch id="em-servico" checked={emServico} onCheckedChange={handleServiceToggle} />
                            <Label htmlFor="em-servico" className="text-sm text-gray-700">
                              Em Serviço
                            </Label>
                          </div>
                        </div>
                        <DropdownMenuSeparator className="bg-gray-200" />
                        <DropdownMenuItem onClick={() => navigate('/prestador-settings')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <Wrench className="mr-2 h-4 w-4 text-gray-600" />
                          <span>Configurações do Prestador</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/agenda')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <Calendar className="mr-2 h-4 w-4 text-gray-600" />
                          <span>Agenda</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/prestador-dashboard')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <BarChart3 className="mr-2 h-4 w-4 text-gray-600" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Client Menu Items */}
                    {!isPrestador && !isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <User className="mr-2 h-4 w-4 text-gray-600" />
                          <span>Meu Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <Settings className="mr-2 h-4 w-4 text-gray-600" />
                          <span>Configurações</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/favoritos')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <Heart className="mr-2 h-4 w-4 text-gray-600" />
                          <span>Favoritos</span>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Admin Menu Items */}
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <Settings className="mr-2 h-4 w-4 text-gray-600" />
                          <span>Configurações de Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/relatorios')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <BarChart3 className="mr-2 h-4 w-4 text-gray-600" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/moderacao')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          <Shield className="mr-2 h-4 w-4 text-gray-600" />
                          <span>Painel de Moderação</span>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Common Menu Items for All Users */}
                    <DropdownMenuItem onClick={() => navigate('/pedidos')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                      <ShoppingBag className="mr-2 h-4 w-4 text-gray-600" />
                      <span>Meus Pedidos</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate('/conversas')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                      <MessageCircle className="mr-2 h-4 w-4 text-gray-600" />
                      <span>Conversas</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate('/enderecos')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                      <MapPin className="mr-2 h-4 w-4 text-gray-600" />
                      <span>Endereços</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate('/notificacoes')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                      <Bell className="mr-2 h-4 w-4 text-gray-600" />
                      <span>Notificações</span>
                    </DropdownMenuItem>

                    {/* PRO Menu Item */}
                    <DropdownMenuItem onClick={() => navigate(isPremium ? '/premium-dashboard' : '/planos')} className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                      <Crown className="mr-2 h-4 w-4 text-yellow-600" />
                      <span>{isPremium ? 'Dashboard PRO' : 'Tornar-se PRO'}</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 focus:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4 text-red-600" />
                      <span>Sair</span>
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
