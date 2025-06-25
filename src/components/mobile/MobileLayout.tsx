
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Search, Calendar, Crown, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const isMobile = useMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { 
      icon: Home, 
      label: 'Início', 
      path: '/', 
      isActive: isActive('/') 
    },
    { 
      icon: Search, 
      label: 'Serviços', 
      path: '/prestadores', 
      isActive: isActive('/prestadores') || isActive('/servicos') 
    },
    { 
      icon: Calendar, 
      label: 'Agenda', 
      path: profile?.tipo === 'prestador' ? '/agenda-prestador' : '/pedidos', 
      isActive: isActive('/agenda-prestador') || isActive('/pedidos') 
    },
    { 
      icon: Crown, 
      label: 'Premium', 
      path: '/planos', 
      isActive: isActive('/planos') 
    },
    { 
      icon: User, 
      label: 'Perfil', 
      path: '/configuracoes', 
      isActive: isActive('/configuracoes') || isActive('/perfil') 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col">
      {/* Header mobile */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Zurbo</h1>
              <p className="text-white/80 text-xs">Conectando talentos</p>
            </div>
          </div>
          
          {profile && (
            <div className="flex items-center gap-2">
              <span className="text-xs capitalize bg-white/20 px-2 py-1 rounded-full">
                {profile.tipo}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo principal com padding para não sobrepor a navegação inferior */}
      <div className="flex-1 px-4 py-6 pb-24">
        {children}
      </div>

      {/* Navegação inferior fixa - Nova dock mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="grid grid-cols-5 px-2 py-2">
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className={`flex flex-col items-center justify-center h-16 rounded-lg transition-all duration-200 ${
                  item.isActive 
                    ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
                onClick={() => navigate(item.path)}
              >
                <IconComponent className={`h-5 w-5 mb-1 ${item.isActive ? 'text-orange-600' : ''}`} />
                <span className={`text-xs font-medium ${item.isActive ? 'text-orange-600' : ''}`}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
