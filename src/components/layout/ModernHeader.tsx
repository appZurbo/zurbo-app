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
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import AuthModal from '@/components/AuthModal';


export const ModernHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAuthenticated, logout, isPrestador, isAdmin } = useAuth();
  const isMobile = useMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Sinop, Mato Grosso');


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
                className="h-10 w-auto object-contain"
              />
            </button>

            {/* Auth section */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-auto p-0 rounded-full">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                          <AvatarFallback className="bg-[#E05815] text-white">
                            {profile?.nome?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <div className="flex items-center gap-2 p-2 focus:outline-none">
                        <div className="flex flex-col space-y-1">
                          <p className="font-medium text-sm">{profile?.nome}</p>
                          <p className="text-xs text-muted-foreground">{profile?.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
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
