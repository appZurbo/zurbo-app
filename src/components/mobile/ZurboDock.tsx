
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Search, Calendar, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile, useTablet } from '@/hooks/useMobile';

export const ZurboDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAuthenticated } = useAuth();
  const isMobile = useMobile();
  const isTablet = useTablet();
  
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
      isActive: isActive(['/prestadores'])
    },
    {
      icon: Calendar,
      label: 'Agenda',
      path: profile?.tipo === 'prestador' ? '/agenda-prestador' : '/pedidos',
      isActive: isActive(['/agenda-prestador', '/pedidos', '/agenda']),
      requiresAuth: true
    },
    {
      icon: MessageCircle,
      label: 'Conversas',
      path: '/mensagens',
      isActive: isActive(['/mensagens', '/conversas']),
      requiresAuth: true
    },
    {
      icon: User,
      label: 'Perfil',
      path: profile?.tipo === 'prestador' ? '/configuracoes' : '/settings',
      isActive: isActive(['/configuracoes', '/settings', '/prestador-settings']),
      fallbackPath: '/auth'
    }
  ];

  const handleNavigation = (item: typeof navigationItems[0]) => {
    if (item.requiresAuth && !isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (!isAuthenticated && item.fallbackPath) {
      navigate(item.fallbackPath);
      return;
    }
    
    navigate(item.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 rounded-t-xl">
      <div className="flex items-center justify-around px-2 py-3 safe-area-padding-bottom">
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          const isItemActive = item.isActive;
          
          return (
            <Button
              key={index}
              variant="ghost"
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
                min-h-[60px] flex-1 max-w-[80px]
                ${isItemActive 
                  ? 'text-[#FF6B00] bg-orange-50' 
                  : 'text-gray-600 hover:text-[#FF6B00] hover:bg-orange-50'
                }
              `}
              onClick={() => handleNavigation(item)}
            >
              <IconComponent 
                className={`h-6 w-6 mb-1 ${isItemActive ? 'text-[#FF6B00]' : ''}`} 
              />
              <span 
                className={`text-xs leading-tight ${
                  isItemActive ? 'font-bold text-[#FF6B00]' : 'font-medium'
                }`}
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
