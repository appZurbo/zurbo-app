import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthModal } from '../AuthModal';
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
  Crown,
  Calendar,
  MessageSquare,
  Heart,
  Bell,
  ChevronDown,
  Info
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

export const UnifiedHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isPremium, isProvider } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Zurbo</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {!user && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/informacoes')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Informações
                </Button>
                <Button variant="outline" onClick={handleAuthClick}>
                  Entrar
                </Button>
                <Button onClick={handleAuthClick} className="bg-orange-500 hover:bg-orange-600">
                  Cadastrar
                </Button>
              </>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
                    <div className="flex items-center space-x-3">
                      {user.foto_url ? (
                        <img 
                          src={user.foto_url} 
                          alt={user.nome}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900">
                          {user.nome?.split(' ')[0]}
                          {isPremium && <Crown className="inline h-3 w-3 text-yellow-500 ml-1" />}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {user.tipo}
                          {isPremium && ' Premium'}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.nome}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      {isPremium && (
                        <Badge variant="secondary" className="text-xs w-fit">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>

                  {isProvider && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/agenda')}>
                        <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                        <span>Agenda</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/prestador-settings')}>
                        <Settings className="mr-2 h-4 w-4 text-green-600" />
                        <span>Config. Prestador</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuItem onClick={() => navigate('/conversas')}>
                    <MessageSquare className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Conversas</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate('/favoritos')}>
                    <Heart className="mr-2 h-4 w-4 text-red-500" />
                    <span>Favoritos</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate('/notificacoes')}>
                    <Bell className="mr-2 h-4 w-4 text-yellow-600" />
                    <span>Notificações</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate('/informacoes')}>
                    <Info className="mr-2 h-4 w-4 text-gray-600" />
                    <span>Informações</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
};
