
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Users, Crown, MessageCircle, User, Calendar } from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';
import { useAuth } from '@/hooks/useAuth';

export const MobileDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const { isAuthenticated, profile } = useAuth();

  // Don't show dock on login/auth pages or if not mobile
  if (!isMobile || location.pathname === '/auth' || location.pathname === '/login') {
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around py-2 px-4">
        {dockItems.filter(item => item.show).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                active 
                  ? 'text-orange-500 bg-orange-50' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
