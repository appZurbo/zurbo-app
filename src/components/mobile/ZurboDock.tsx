
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Search, Calendar, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile, useTablet } from '@/hooks/useMobile';
import { useNotifications } from '@/hooks/useNotifications';

export const ZurboDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAuthenticated, isPrestador } = useAuth();
  const isMobile = useMobile();
  const isTablet = useTablet();
  
  // Only use notifications hook if user is authenticated to prevent errors
  const { hasNewMessages } = isAuthenticated ? useNotifications() : { hasNewMessages: false };
  
  // Show only on mobile and tablet
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
      isActive: isActive('/prestadores'),
      showAlways: true
    },
    {
      icon: Calendar,
      label: isPrestador ? 'Agenda' : 'Pedidos',
      path: isPrestador ? '/agenda' : '/pedidos',
      isActive: isActive('/agenda') || isActive('/pedidos'),
      requiresAuth: true
    },
    {
      icon: MessageCircle,
      label: 'Conversas',
      path: '/conversas',
      isActive: isActive('/conversas'),
      badge: hasNewMessages,
      requiresAuth: true
    },
    {
      icon: User,
      label: 'Perfil',
      path: isAuthenticated 
        ? (isPrestador ? '/configuracoes' : '/settings')
        : '/auth',
      isActive: isActive('/configuracoes') || isActive('/settings') || isActive('/auth'),
      showAlways: true
    }
  ];

  const visibleItems = navigationItems.filter(item => 
    item.showAlways || (item.requiresAuth && isAuthenticated)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg z-50 safe-area-padding-bottom">
      <div className="flex items-center h-20 px-4 py-2 justify-between">
        {visibleItems.map((item, index) => {
          const IconComponent = item.icon;
          
          return (
            <Button
              key={index}
              variant="ghost"
              size="dock"
              className={`
                relative transition-all duration-200 rounded-xl flex-col min-h-16 w-16
                ${item.isActive 
                  ? 'bg-orange-100 text-orange-600 border border-orange-200 shadow-sm' 
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }
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
                      className="absolute -top-2 -right-2 h-2 w-2 p-0 text-xs bg-red-500 text-white border-2 border-white animate-pulse"
                    />
                  )}
                </div>
                <span 
                  className={`mt-1 font-medium leading-none text-xs ${
                    item.isActive ? 'text-orange-600 font-semibold' : ''
                  }`}
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
