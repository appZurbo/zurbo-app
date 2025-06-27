
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Users, Crown, MessageCircle, User, Calendar } from 'lucide-react';
import { useMobile, useMobileOrTablet } from '@/hooks/useMobile';
import { useAuth } from '@/hooks/useAuth';

export const MobileDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const isMobileOrTablet = useMobileOrTablet();
  const { isAuthenticated, profile } = useAuth();

  // Don't show dock on login/auth pages or if desktop
  if (!isMobileOrTablet || location.pathname === '/auth' || location.pathname === '/login') {
    return null;
  }

  // Dynamic agenda path based on user type
  const getAgendaPath = () => {
    if (!profile) return '/pedidos';
    return profile.tipo === 'prestador' ? '/agenda-prestador' : '/pedidos';
  };

  const dockItems = [
    {
      icon: Home,
      label: 'Início',
      path: '/',
      show: true
    },
    {
      icon: Users,
      label: 'Prestadores',
      path: '/prestadores',
      show: true
    },
    {
      icon: Calendar,
      label: 'Agenda',
      path: getAgendaPath(),
      show: isAuthenticated
    },
    {
      icon: MessageCircle,
      label: 'Conversas',
      path: '/conversas',
      show: isAuthenticated
    },
    {
      icon: User,
      label: 'Perfil',
      path: '/configuracoes',
      show: isAuthenticated
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const visibleItems = dockItems.filter(item => item.show);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      {/* Container with max width and centering for tablets */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center py-1.5 px-2">
          {/* Grid that adapts to number of visible items and centers them */}
          <div 
            className="grid gap-1"
            style={{ 
              gridTemplateColumns: `repeat(${visibleItems.length}, 1fr)`,
              width: '100%',
              maxWidth: `${visibleItems.length * 70}px` // Reduced from 80px to 70px
            }}
          >
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-0.5 h-auto py-2 px-2 rounded-lg transition-all duration-200 ${
                    active 
                      ? 'text-orange-500 bg-orange-50 shadow-sm scale-105' 
                      : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium leading-tight">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
