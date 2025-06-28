
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Search, Calendar, User, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile, useTablet } from '@/hooks/useMobile';

export const UnifiedDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAuthenticated, isPrestador } = useAuth();
  const isMobile = useMobile();
  const isTablet = useTablet();
  
  // Só mostra em mobile e tablet
  if (!isMobile && !isTablet) return null;

  const isActive = (path: string) => location.pathname === path;
  
  const navigationItems = [
    {
      icon: Home,
      label: 'Início',
      path: '/',
      isActive: isActive('/'),
      showAlways: true
    },
    {
      icon: Search,
      label: 'Buscar',
      path: '/prestadores',
      isActive: isActive('/prestadores') || isActive('/servicos'),
      showAlways: true
    },
    {
      icon: Calendar,
      label: 'Agenda',
      path: profile?.tipo === 'prestador' ? '/agenda-prestador' : '/pedidos',
      isActive: isActive('/agenda-prestador') || isActive('/pedidos') || isActive('/agenda'),
      highlight: profile?.tipo === 'prestador',
      requiresAuth: true
    },
    {
      icon: MessageCircle,
      label: 'Conversas',
      path: '/conversas',
      isActive: isActive('/conversas'),
      badge: 2, // Mock notification count
      requiresAuth: true
    },
    {
      icon: User,
      label: 'Perfil',
      path: isAuthenticated 
        ? '/configuracoes'
        : '/auth',
      isActive: isActive('/configuracoes') || isActive('/prestador-settings') || isActive('/settings') || isActive('/auth'),
      showAlways: true
    }
  ];

  const visibleItems = navigationItems.filter(item => 
    item.showAlways || (item.requiresAuth && isAuthenticated)
  );

  const getDockHeight = () => {
    if (isMobile) return 'h-20'; // Mais alto em mobile para melhor usabilidade
    if (isTablet) return 'h-18'; // Ligeiramente menor em tablet
    return 'h-16';
  };

  const getButtonSize = (): "dock" => {
    return 'dock'; // Always use 'dock' size for unified dock
  };

  const getDockContainerClass = () => {
    if (isTablet) {
      // Para tablet, centraliza os ícones mesmo em modo paisagem
      return `flex justify-center items-center ${getDockHeight()} px-4 py-1`;
    }
    return `grid grid-cols-${visibleItems.length} h-full px-2 py-1 gap-1`;
  };

  const getItemContainerClass = () => {
    if (isTablet) {
      return "flex items-center gap-4"; // Centralizado no tablet
    }
    return ""; // Grid padrão para mobile
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg z-50 ${getDockHeight()} safe-area-padding-bottom`}>
      <div className={getDockContainerClass()}>
        <div className={getItemContainerClass()}>
          {visibleItems.map((item, index) => {
            const IconComponent = item.icon;
            const isAgendaDestaque = item.highlight && profile?.tipo === 'prestador';
            
            return (
              <Button
                key={index}
                variant="ghost"
                size={getButtonSize()}
                className={`
                  relative transition-all duration-200 rounded-lg
                  ${item.isActive 
                    ? 'bg-orange-100 text-orange-600 border border-orange-200 shadow-sm' 
                    : isAgendaDestaque 
                      ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50' 
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }
                  ${isMobile ? 'min-h-16' : 'min-h-14'}
                  ${isTablet ? 'flex-col w-16 h-16' : ''}
                `}
                onClick={() => navigate(item.path)}
              >
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="relative">
                    <IconComponent 
                      className={`
                        ${isMobile ? 'h-6 w-6' : 'h-5 w-5'} 
                        ${item.isActive ? 'text-orange-600' : isAgendaDestaque ? 'text-orange-500' : ''}
                      `} 
                    />
                    {item.badge && (
                      <Badge 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 text-white border-2 border-white"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span 
                    className={`
                      mt-1 font-medium leading-none
                      ${isMobile ? 'text-xs' : 'text-xs'} 
                      ${item.isActive ? 'text-orange-600' : isAgendaDestaque ? 'text-orange-500' : ''}
                    `}
                  >
                    {item.label}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
