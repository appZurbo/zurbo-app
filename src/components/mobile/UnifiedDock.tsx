
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Search, Calendar, MessageCircle, Map as MapIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile, useTablet } from '@/hooks/useMobile';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import TactileCalendar from '@/components/ui/TactileCalendar';

export const UnifiedDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAuthenticated, isPrestador } = useAuth();
  const isMobile = useMobile();
  const isTablet = useTablet();
  const { unreadCount: chatUnreadCount } = useRealtimeChat();

  // Show on mobile and tablet
  if (!isMobile && !isTablet) return null;

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
      isActive: isActive('/'),
      showAlways: true
    },
    {
      icon: Search,
      label: 'Explorar',
      path: '/prestadores',
      isActive: isActive('/prestadores') || isActive('/servicos'),
      showAlways: true
    },
    {
      icon: Calendar,
      label: isPrestador ? 'Agenda' : 'Pedidos',
      path: isPrestador ? '/agenda' : '/pedidos',
      isActive: isActive('/agenda') || isActive('/pedidos'),
      requiresAuth: true,
      isCenter: true
    },
    {
      icon: MapIcon,
      label: 'Mapa',
      path: '/mapa-servicos',
      isActive: isActive('/mapa-servicos'),
      showAlways: true
    },
    {
      icon: MessageCircle,
      label: 'Chat',
      path: '/conversas',
      isActive: isActive('/conversas'),
      badge: chatUnreadCount > 0 ? chatUnreadCount : undefined,
      requiresAuth: true
    }
  ];

  const visibleItems = navigationItems.filter(item =>
    item.showAlways || (item.requiresAuth && isAuthenticated)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 safe-area-padding-bottom">
      <div className={`flex items-center justify-around py-3 ${isTablet
        ? 'max-w-md mx-auto'
        : ''
        }`}>
        {visibleItems.map((item, index) => {
          const IconComponent = item.icon;
          const isCenter = item.isCenter;

          if (isCenter) {
            return (
              <div key={index} className="flex flex-col items-center justify-center px-2">
                <div className="relative transition-transform hover:scale-110 active:scale-95">
                  <TactileCalendar
                    onClick={() => navigate(item.path)}
                    className="shadow-2xl shadow-orange-500/20"
                  />
                </div>
              </div>
            );
          }

          return (
            <Button
              key={index}
              variant="ghost"
              className={`
                flex flex-col items-center gap-1 transition-colors
                ${item.isActive
                  ? 'text-[#E05815]'
                  : 'text-[#8C7E72] hover:text-[#E05815]'
                }
              `}
              onClick={() => navigate(item.path)}
            >
              <div className="relative">
                <IconComponent className="h-6 w-6" />
                {item.badge && item.badge > 0 && (
                  <span
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#E05815] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white/50"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] leading-none ${item.isActive ? 'font-bold' : 'font-medium'}`}
              >
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
