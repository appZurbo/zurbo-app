import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { Home, User, Settings, Search, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import type { TabItem } from '@/components/ui/expandable-tabs';

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

  const tabs: TabItem[] = [
    { title: "Início", icon: Home },
    { title: "Serviços", icon: Search },
    { title: "Perfil", icon: User },
    { type: "separator" },
    { title: "Config", icon: Settings },
  ];

  const handleTabChange = (index: number | null) => {
    if (index === null) return;
    
    const routes = ['/', '/servicos', '/perfil', null, '/configuracoes'];
    const route = routes[index];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header mobile aprimorado */}
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
          
          <div className="flex items-center gap-2">
            {profile && (
              <div className="flex items-center gap-2">
                <span className="text-xs capitalize bg-white/20 px-2 py-1 rounded-full">
                  {profile.tipo}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-2"
                  onClick={() => navigate('/notificacoes')}
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navegação com ExpandableTabs */}
      <div className="px-4 py-3 bg-white shadow-sm">
        <ExpandableTabs 
          tabs={tabs}
          onChange={handleTabChange}
          activeColor="text-orange-500"
          className="border-orange-200"
        />
      </div>

      {/* Conteúdo principal */}
      <div className="px-4 py-6 min-h-[calc(100vh-160px)]">
        {children}
      </div>

      {/* Footer mobile */}
      <div className="bg-white border-t border-gray-200 p-4 text-center">
        <p className="text-xs text-gray-500">
          © 2024 Zurbo - Conectando você aos melhores profissionais
        </p>
      </div>
    </div>
  );
};
