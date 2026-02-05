import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Settings,
  LogOut,
  User,
  Crown,
  ChevronDown,
  BarChart3,
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Map as MapIcon,
  Bell,
  Info,
  Star,
  FileText,
  Users,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import AuthModal from '@/components/AuthModal';
import { Badge } from '@/components/ui/badge';

export const ModernHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAuthenticated, logout, isPrestador, isAdmin } = useAuth();
  const isMobile = useMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isPremium = profile?.premium || false;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Only show on prestadores page
  if (location.pathname !== '/prestadores' && !location.pathname.startsWith('/prestadores')) {
    return null;
  }

  return (
    <>
      <header className="bg-[#FBF7F2] sticky top-0 z-50 border-b border-[#E6DDD5]">
        <div className="max-w-7xl mx-auto px-5">
          {/* Main section with logo and auth */}
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center p-0 hover:opacity-80 transition-opacity"
            >
              <img
                src="/newlogo.png"
                alt="Zurbo Logo"
                className="h-7 md:h-10 w-auto object-contain"
              />
            </button>

            {/* Auth section */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 h-auto p-2 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-xl transition-all border border-[#E6DDD5]/50 shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          {profile?.foto_url ? (
                            <img
                              src={profile.foto_url}
                              alt={profile.nome || 'User'}
                              className="h-8 w-8 rounded-full object-cover border-2 border-white"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          )}
                          {!isMobile && (
                            <div className="flex flex-col items-start mr-1">
                              <span className="text-sm font-bold text-gray-900 leading-tight">
                                {profile?.nome?.split(' ')[0] || 'Menu'}
                              </span>
                            </div>
                          )}
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-md border-[#E6DDD5] shadow-xl rounded-2xl p-2" align="end" forceMount>
                      <div className="flex items-center justify-start gap-3 p-3 mb-2 bg-orange-50/30 rounded-xl">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-bold text-gray-900">{profile?.nome || 'Usuário'}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{profile?.email}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <Badge variant="outline" className="text-[9px] uppercase font-black text-orange-600 border-orange-200 bg-white px-2 py-0">
                              {isPrestador ? 'Prestador' : 'Cliente'}
                            </Badge>
                            {isPremium && (
                              <Badge className="text-[9px] uppercase font-black bg-orange-500 text-white border-none px-2 py-0">
                                <Crown className="h-2.5 w-2.5 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-gray-100 mx-2" />

                      <div className="mt-2 space-y-1">
                        <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                          <Settings className="mr-3 h-4 w-4" />
                          <span className="font-semibold text-sm">Configurações</span>
                        </DropdownMenuItem>

                        {isPrestador && (
                          <>
                            <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                              <BarChart3 className="mr-3 h-4 w-4" />
                              <span className="font-semibold text-sm">Painel do Prestador</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/agenda')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                              <Calendar className="mr-3 h-4 w-4" />
                              <span className="font-semibold text-sm">Agenda</span>
                            </DropdownMenuItem>
                          </>
                        )}

                        {!isPrestador && !isAdmin && (
                          <>
                            <DropdownMenuItem onClick={() => navigate('/pedidos')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                              <Clock className="mr-3 h-4 w-4" />
                              <span className="font-semibold text-sm">Meus Agendamentos</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/favoritos')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                              <Heart className="mr-3 h-4 w-4" />
                              <span className="font-semibold text-sm">Favoritos</span>
                            </DropdownMenuItem>
                          </>
                        )}

                        <DropdownMenuItem onClick={() => navigate('/conversas')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                          <MessageSquare className="mr-3 h-4 w-4" />
                          <span className="font-semibold text-sm">Conversas</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => navigate('/mapa-servicos')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                          <MapIcon className="mr-3 h-4 w-4" />
                          <span className="font-semibold text-sm">Mapa de Serviços</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => navigate('/notificacoes')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                          <Bell className="mr-3 h-4 w-4" />
                          <span className="font-semibold text-sm">Notificações</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => navigate('/informacoes')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                          <Info className="mr-3 h-4 w-4" />
                          <span className="font-semibold text-sm">Informações</span>
                        </DropdownMenuItem>

                        {profile?.premium && (
                          <DropdownMenuItem onClick={() => navigate('/premium-overview')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                            <Star className="mr-3 h-4 w-4" />
                            <span className="font-semibold text-sm">Plano PRO</span>
                          </DropdownMenuItem>
                        )}

                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator className="bg-gray-100 mx-2" />
                            <DropdownMenuItem onClick={() => navigate('/admin/relatorios')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                              <FileText className="mr-3 h-4 w-4" />
                              <span className="font-semibold text-sm">Painel Administrativo</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => navigate('/admin/users')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                              <Users className="mr-3 h-4 w-4" />
                              <span className="font-semibold text-sm">Gerenciar Usuários</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => navigate('/admin/moderacao')} className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                              <Shield className="mr-3 h-4 w-4" />
                              <span className="font-semibold text-sm">Moderação</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </div>

                      <DropdownMenuSeparator className="bg-gray-100 mx-2 mt-2" />
                      <DropdownMenuItem onClick={handleLogout} className="rounded-lg focus:bg-red-50 focus:text-red-600 cursor-pointer py-2 mt-1">
                        <LogOut className="mr-3 h-4 w-4 text-red-500" />
                        <span className="font-black uppercase text-[10px] tracking-widest text-red-500">Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-[#E05815] hover:bg-[#E05815]/90 text-white font-bold h-10 px-6 rounded-xl transition-all"
                >
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => { }}
      />
    </>
  );
};
