
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings as SettingsIcon, User, Wrench, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserSettings } from '@/components/settings/UserSettings';
import PrestadorSettings from './PrestadorSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import GerenciadorBairros from '@/components/bairros/GerenciadorBairros';
import { useMobile } from '@/hooks/useMobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  const navigate = useNavigate();
  const { profile, isPrestador, loading } = useAuth();
  const isMobile = useMobile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para acessar as configurações.
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-6xl mx-auto p-4'}`}>
        {/* Header com botão voltar - otimizado para mobile */}
        <div className={`flex items-center gap-3 mb-6 ${isMobile ? 'sticky top-0 bg-gray-50 py-2 z-10' : ''}`}>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {!isMobile && 'Voltar'}
          </Button>
          <div className="flex-1">
            <h1 className={`font-bold text-gray-900 flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              <SettingsIcon className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
              Configurações
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              {isPrestador ? (
                <>
                  <Wrench className="h-4 w-4 inline mr-1" />
                  Painel do Prestador
                </>
              ) : (
                <>
                  <User className="h-4 w-4 inline mr-1" />
                  Configurações do Cliente
                </>
              )}
            </p>
          </div>
        </div>

        {/* Container principal com abas */}
        <div className={`${isMobile ? 'space-y-4' : ''}`}>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className={`grid w-full ${isPrestador ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Perfil
              </TabsTrigger>
              {isPrestador && (
                <TabsTrigger value="bairros" className="flex items-center gap-2">
                  <Settings as any className="h-4 w-4" />
                  Bairros
                </TabsTrigger>
              )}
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Segurança
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              {isPrestador ? <PrestadorSettings /> : <UserSettings />}
            </TabsContent>
            
            {isPrestador && (
              <TabsContent value="bairros">
                <GerenciadorBairros />
              </TabsContent>
            )}
            
            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
