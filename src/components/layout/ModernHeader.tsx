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
  MapPin,
  Settings,
  SlidersHorizontal,
  User,
  LogOut,
  Heart,
  Bell,
  Calendar,
  BarChart3,
  Crown,
  Map
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import AuthModal from '@/components/AuthModal';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchDropdown } from '@/components/SearchDropdown';

const CIDADES_DISPONIVEIS = [
  'Sinop, Mato Grosso',
  'Sorriso, Mato Grosso',
  'Lucas do Rio Verde, Mato Grosso',
  'Nova Mutum, Mato Grosso',
  'Vera, Mato Grosso',
  'Itanhangá, Mato Grosso'
];

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
          {/* Top section with greeting and location */}
          <div className="flex justify-between items-center pt-3 pb-2">
            <div className="flex flex-col">
              <span className="text-sm text-[#8C7E72] mb-0.5">
                {isAuthenticated ? `Olá, ${profile?.nome?.split(' ')[0] || 'bem-vindo'}!` : 'Olá, bem-vindo de volta!'}
              </span>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-5 w-5 text-[#E05815]" />
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-auto p-0 border-0 bg-transparent text-lg font-bold text-[#3D342B] hover:text-[#E05815] focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CIDADES_DISPONIVEIS.map((cidade) => (
                      <SelectItem key={cidade} value={cidade}>
                        {cidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* User Avatar */}
            {isAuthenticated ? (
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto p-0 rounded-full">
                      <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                        <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                        <AvatarFallback className="bg-[#E05815] text-white">
                          {profile?.nome?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-[#FBF7F2]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium text-sm">{profile?.nome}</p>
                        <p className="text-xs text-muted-foreground">{profile?.email}</p>
                        {isPremium && (
                          <Badge variant="secondary" className="text-xs w-fit mt-1">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </DropdownMenuItem>
                    {isPrestador && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/agenda')}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Agenda
                        </DropdownMenuItem>
                      </>
                    )}
                    {!isPrestador && (
                      <DropdownMenuItem onClick={() => navigate('/favoritos')}>
                        <Heart className="mr-2 h-4 w-4" />
                        Favoritos
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate('/mapa-servicos')}>
                      <Map className="mr-2 h-4 w-4" />
                      Mapa de Serviços
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/notificacoes')}>
                      <Bell className="mr-2 h-4 w-4" />
                      Notificações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="text-[#3D342B] hover:text-[#E05815]"
                >
                  Entrar
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#E05815] hover:bg-[#E05815]/90 text-white"
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <SearchDropdown
              placeholder="Buscar serviços..."
              onSearchSubmit={(query) => {
                if (query.trim()) {
                  navigate(`/prestadores?search=${encodeURIComponent(query)}`);
                }
              }}
              onFiltersClick={() => {
                // TODO: Implementar abertura dos filtros avançados
                console.log('Abrir filtros avançados');
              }}
            />
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
