
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
  const { profile, isAuthenticated } = useAuth();
  const isMobile = useMobile();
  const isTablet = useTablet();
  const { hasNewMessages } = useNotifications();
  
  // Only show on mobile and tablet
  if (!isMobile && !isTablet) return null;

  const isActive = (paths: string[]) => paths.includes(location.pathname);
  
  const navigationItems = [
    {
      icon: Home,
      label: 'Início',
      path: '/',
      isActive: isActive(['/'])
    },
    {
      icon: Search,
      label: 'Buscar',
      path: '/prestadores',
      isActive: isActive(['/prestadores', '/servicos'])
    },
    {
      icon: Calendar,
      label: 'Agenda',
      path: profile?.tipo === 'prestador' ? '/agenda' : '/pedidos',
      isActive: isActive(['/agenda', '/pedidos', '/agenda-prestador'])
    },
    {
      icon: MessageCircle,
      label: 'Conversas',
      path: '/conversas',
      isActive: isActive(['/conversas', '/mensagens']),
      badge: hasNewMessages
    },
    {
      icon: User,
      label: 'Perfil',
      path: isAuthenticated 
        ? (profile?.tipo === 'prestador' ? '/prestador-settings' : '/configuracoes')
        : '/auth',
      isActive: isActive(['/configuracoes', '/prestador-settings', '/settings', '/auth'])
    }
  ];

  return (
    <>
      {/* Bottom spacing for content */}
      <div className="h-20 md:h-24" />
      
      {/* Fixed dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg rounded-t-2xl">
        <div className={`flex items-center justify-around px-4 py-3 ${
          isTablet ? 'max-w-md mx-auto' : ''
        }`}>
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <Button
                key={index}
                variant="ghost"
                className={`
                  relative flex flex-col items-center justify-center 
                  min-h-14 px-3 py-2 rounded-xl transition-all duration-200
                  ${item.isActive 
                    ? 'bg-orange-50 text-orange-600 border border-orange-200/60 shadow-sm' 
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50'
                  }
                  ${isTablet ? 'min-w-16' : 'flex-1'}
                `}
                onClick={() => navigate(item.path)}
              >
                <div className="relative mb-1">
                  <IconComponent 
                    className={`h-5 w-5 ${item.isActive ? 'text-orange-600' : ''}`} 
                  />
                  {item.badge && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs bg-red-500 text-white border-2 border-white animate-pulse"
                      style={{ fontSize: '10px', minWidth: '16px' }}
                    />
                  )}
                </div>
                <span 
                  className={`text-xs font-medium leading-tight ${
                    item.isActive ? 'text-orange-600 font-semibold' : ''
                  }`}
                >
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
        
        {/* Safe area bottom padding for iOS */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </>
  );
};
