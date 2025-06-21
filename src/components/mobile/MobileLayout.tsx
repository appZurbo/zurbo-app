
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Home, User, Settings, Search, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header mobile */}
      <div className="bg-orange-500 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Zurbo</h1>
          <div className="flex items-center gap-2">
            {profile && (
              <span className="text-sm capitalize bg-orange-600 px-2 py-1 rounded">
                {profile.tipo}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-orange-600"
              onClick={() => navigate('/')}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="px-4 py-6 min-h-[calc(100vh-140px)]">
        {children}
      </div>

      {/* Navigation Bar inferior mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 shadow-lg">
        <div className="flex justify-around items-center">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${
              isActive('/') ? 'text-orange-500 bg-orange-50' : 'text-gray-600'
            }`}
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Início</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${
              isActive('/servicos') ? 'text-orange-500 bg-orange-50' : 'text-gray-600'
            }`}
            onClick={() => navigate('/servicos')}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Serviços</span>
          </Button>

          {profile?.tipo === 'prestador' && (
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${
                isActive('/agenda') ? 'text-orange-500 bg-orange-50' : 'text-gray-600'
              }`}
              onClick={() => navigate('/agenda')}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Agenda</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${
              isActive('/perfil') ? 'text-orange-500 bg-orange-50' : 'text-gray-600'
            }`}
            onClick={() => navigate('/perfil')}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Perfil</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${
              isActive('/configuracoes') ? 'text-orange-500 bg-orange-50' : 'text-gray-600'
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
