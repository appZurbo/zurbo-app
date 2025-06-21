
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const { profile, isAuthenticated, isPrestador } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 orange-gradient rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <h1 className="text-2xl font-bold text-gradient">ZURBO</h1>
        </div>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.foto_url} />
                  <AvatarFallback>{profile?.nome?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{profile?.nome}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground capitalize">
                    {profile?.tipo}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/perfil')}>
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              {isPrestador && (
                <DropdownMenuItem onClick={() => navigate('/servicos')}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Meus Serviços</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => window.location.reload()}>
            Entrar
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
