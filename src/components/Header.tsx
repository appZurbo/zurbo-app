
import { User, LogOut, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    type: 'cliente' | 'prestador';
    avatar?: string;
  };
  onLogin: () => void;
  onLogout: () => void;
  onBecomePrestador: () => void;
}

const Header = ({ user, onLogin, onLogout, onBecomePrestador }: HeaderProps) => {
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 orange-gradient rounded-xl flex items-center justify-center logo-shadow">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <h1 className="text-3xl font-bold text-gradient tracking-tight">
                ZURBO
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-orange-50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="hover:bg-orange-50">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-orange-50">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  {user.type === 'cliente' && (
                    <DropdownMenuItem onClick={onBecomePrestador} className="hover:bg-orange-50">
                      <User className="mr-2 h-4 w-4" />
                      <span>Tornar-se Prestador</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={onLogout} className="hover:bg-orange-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onLogin} className="orange-gradient hover:opacity-90 font-medium px-6">
                Entrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
