
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Search, Calendar, Crown, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';

interface MobileLayoutImprovedProps {
  children?: ReactNode;
}

export const MobileLayoutImproved = ({
  children
}: MobileLayoutImprovedProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    profile
  } = useAuth();
  const isMobile = useMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [{
    icon: Home,
    label: 'Início',
    path: '/',
    isActive: isActive('/')
  }, {
    icon: Search,
    label: 'Serviços',
    path: '/prestadores',
    isActive: isActive('/prestadores') || isActive('/servicos')
  }, {
    icon: Calendar,
    label: 'Agenda',
    path: profile?.tipo === 'prestador' ? '/agenda-prestador' : '/pedidos',
    isActive: isActive('/agenda-prestador') || isActive('/pedidos'),
    highlight: profile?.tipo === 'prestador' // Destaque laranja para prestadores
  }, {
    icon: Crown,
    label: 'Premium',
    path: '/planos',
    isActive: isActive('/planos')
  }, {
    icon: User,
    label: 'Perfil',
    path: '/configuracoes',
    isActive: isActive('/configuracoes') || isActive('/perfil')
  }];

  return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col">
      {/* Header mobile */}
      

      {/* Conteúdo principal com padding para não sobrepor a navegação inferior */}
      <div className="flex-1 pb-24 px-0 py-0">
        {children}
      </div>

      {/* Navegação inferior fixa - Dock melhorado */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="grid grid-cols-5 px-2 py-2">
          {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          const isAgendaDestaque = item.highlight && profile?.tipo === 'prestador';
          return <Button key={index} variant="ghost" className={`flex flex-col items-center justify-center h-16 rounded-lg transition-all duration-200 ${item.isActive ? 'bg-orange-50 text-orange-600 border border-orange-200' : isAgendaDestaque ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`} onClick={() => navigate(item.path)}>
                <IconComponent className={`h-5 w-5 mb-1 ${item.isActive ? 'text-orange-600' : isAgendaDestaque ? 'text-orange-500' : ''}`} />
                <span className={`text-xs font-medium ${item.isActive ? 'text-orange-600' : isAgendaDestaque ? 'text-orange-500' : ''}`}>
                  {item.label}
                </span>
              </Button>;
        })}
        </div>
      </div>
    </div>;
};
