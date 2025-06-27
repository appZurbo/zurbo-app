
import { Home, Search, MessageCircle, User, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const MobileDock = () => {
  const location = useLocation();
  const { isAuthenticated, profile } = useAuth();
  const isActive = (path: string) => location.pathname === path;
  
  const isPrestador = profile?.tipo === 'prestador';

  const navItems = [
    {
      icon: Home,
      label: 'Início',
      path: '/'
    },
    {
      icon: Search,
      label: 'Buscar',
      path: '/prestadores'
    },
    {
      icon: Calendar,
      label: 'Agenda',
      path: isPrestador ? '/agenda-prestador' : '/pedidos',
      requiresAuth: true
    },
    {
      icon: MessageCircle,
      label: 'Conversas',
      path: '/conversas',
      requiresAuth: true
    },
    {
      icon: User,
      label: 'Perfil',
      path: isAuthenticated 
        ? (isPrestador ? '/prestador-settings' : '/configuracoes') 
        : '/auth'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40 lg:hidden">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          if (item.requiresAuth && !isAuthenticated) return null;
          const IconComponent = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                active 
                  ? 'text-orange-500 bg-orange-50' 
                  : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              <div className="relative">
                <IconComponent className="h-5 w-5" />
                {item.label === 'Conversas' && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    2
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileDock;
