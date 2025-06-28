
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
  
  // Show on mobile and tablet
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
      path: isPrestador ? '/agenda-prestador' : '/pedidos',
      isActive: isActive('/agenda-prestador') || isActive('/pedidos') || isActive('/agenda'),
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg z-50 safe-area-padding-bottom">
      <div className={`flex items-center h-20 px-4 py-2 ${
        isTablet 
          ? 'justify-center max-w-md mx-auto' 
          : 'justify-between'
      }`}>
        {visibleItems.map((item, index) => {
          const IconComponent = item.icon;
          
          return (
            <Button
              key={index}
              variant="ghost"
              size="dock"
              className={`
                relative transition-all duration-200 rounded-lg flex-col
                ${item.isActive 
                  ? 'bg-orange-100 text-orange-600 border border-orange-200 shadow-sm' 
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }
                ${isTablet ? 'min-h-16 w-20 mx-2' : 'min-h-16 w-16'}
              `}
              onClick={() => navigate(item.path)}
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="relative">
                  <IconComponent 
                    className={`h-6 w-6 ${item.isActive ? 'text-orange-600' : ''}`} 
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
                  className={`mt-1 font-medium leading-none text-xs ${item.isActive ? 'text-orange-600' : ''}`}
                >
                  {item.label}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
