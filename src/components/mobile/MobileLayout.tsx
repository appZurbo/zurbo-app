
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Home, User, Settings, MessageSquare, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header mobile */}
      <div className="bg-orange-500 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Zurbo</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-orange-600"
            onClick={() => navigate('/buscar')}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="px-4 py-6">
        {children}
      </div>

      {/* Navigation Bar inferior mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/') ? 'text-orange-500' : 'text-gray-600'
            }`}
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Início</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/buscar') ? 'text-orange-500' : 'text-gray-600'
            }`}
            onClick={() => navigate('/buscar')}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Buscar</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/perfil') ? 'text-orange-500' : 'text-gray-600'
            }`}
            onClick={() => navigate('/perfil')}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Perfil</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/configuracoes') ? 'text-orange-500' : 'text-gray-600'
            }`}
            onClick={() => navigate('/configuracoes')}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Config</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
