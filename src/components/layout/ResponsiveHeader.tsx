
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Calendar, 
  MessageSquare, 
  Heart,
  Bell,
  Search,
  Home,
  Briefcase,
  MapPin,
  Crown,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useMobile } from '@/hooks/useMobile';

export const ResponsiveHeader = () => {
  const { isAuthenticated, profile, signOut, isPrestador, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsSheetOpen(false);
      navigate('/');
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const navigationItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Search, label: 'Buscar', path: '/buscar' },
    ...(isAuthenticated ? [
      { icon: Calendar, label: 'Agenda', path: '/agenda' },
      { icon: MessageSquare, label: 'Chat', path: '/chat' },
      { icon: Heart, label: 'Favoritos', path: '/favoritos' },
    ] : []),
    ...(isPrestador ? [
      { icon: Briefcase, label: 'Meus Serviços', path: '/prestador/servicos' },
      { icon: Wrench, label: 'Prestador', path: '/prestador' },
    ] : []),
    ...(isAdmin ? [
      { icon: Shield, label: 'Admin', path: '/admin' },
    ] : [])
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          {!isMobile && (
            <span className="font-bold text-lg">ZapService</span>
          )}
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center space-x-6 text-sm font-medium mx-6">
            {navigationItems.slice(0, 3).map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`transition-colors hover:text-foreground/80 flex items-center gap-2 ${
                  location.pathname === item.path ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Notification Bell */}
          {isAuthenticated && (
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                2
              </Badge>
            </Button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* User Avatar */}
              <div className="flex items-center gap-2">
                {!isMobile && (
                  <div className="text-right">
                    <p className="text-sm font-medium">{profile?.nome}</p>
                    <div className="flex items-center gap-1">
                      {isPrestador && (
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-600">
                          <Wrench className="h-3 w-3 mr-1" />
                          Prestador
                        </Badge>
                      )}
                      {profile?.premium && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-600">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                        <AvatarFallback className="bg-orange-100 text-orange-600">
                          {profile?.nome?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </SheetTrigger>
                  
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col h-full">
                      {/* User Info */}
                      <div className="flex items-center gap-3 pb-6 border-b">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                          <AvatarFallback className="bg-orange-100 text-orange-600 text-lg">
                            {profile?.nome?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{profile?.nome}</h3>
                          <p className="text-sm text-gray-600">{profile?.email}</p>
                          <div className="flex gap-1 mt-1">
                            {isPrestador && (
                              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-600">
                                <Wrench className="h-3 w-3 mr-1" />
                                Prestador
                              </Badge>
                            )}
                            {profile?.premium && (
                              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-600">
                                <Crown className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Navigation Items */}
                      <nav className="flex-1 py-4">
                        <div className="space-y-2">
                          {navigationItems.map((item) => (
                            <Button
                              key={item.path}
                              variant={location.pathname === item.path ? "secondary" : "ghost"}
                              className="w-full justify-start"
                              onClick={() => handleNavigation(item.path)}
                            >
                              <item.icon className="h-4 w-4 mr-3" />
                              {item.label}
                            </Button>
                          ))}
                          
                          <div className="border-t pt-2 mt-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => handleNavigation('/settings')}
                            >
                              <Settings className="h-4 w-4 mr-3" />
                              Configurações
                            </Button>
                          </div>
                        </div>
                      </nav>

                      {/* Sign Out */}
                      <div className="border-t pt-4">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sair
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth')}
              >
                Entrar
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/auth')}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Cadastrar
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <nav className="flex flex-col gap-4">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={location.pathname === item.path ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => handleNavigation(item.path)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};
