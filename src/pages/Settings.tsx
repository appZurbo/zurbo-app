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
  const {
    profile,
    isPrestador,
    loading
  } = useAuth();
  const isMobile = useMobile();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>;
  }
  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center p-4">
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
      </div>;
  }
  return <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
        {/* Header centralizado */}
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="absolute left-4 top-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center rounded-sm">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configurações
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            {isPrestador ? <>
                <Wrench className="h-4 w-4" />
                Painel do Prestador
              </> : <>
                <User className="h-4 w-4" />
                Configurações do Cliente
              </>}
          </p>
        </div>

        {/* Tabs organizadas centralmente */}
        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className={`grid w-full ${isPrestador ? 'grid-cols-3' : 'grid-cols-2'} bg-white shadow-sm`}>
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
                <User className="h-4 w-4" />
                {isMobile ? 'Perfil' : 'Meu Perfil'}
              </TabsTrigger>
              {isPrestador && <TabsTrigger value="bairros" className="flex items-center gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
                  <SettingsIcon className="h-4 w-4" />
                  {isMobile ? 'Bairros' : 'Área de Atendimento'}
                </TabsTrigger>}
              <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
                <Shield className="h-4 w-4" />
                {isMobile ? 'Segurança' : 'Privacidade & Segurança'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-500" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  {isPrestador ? <PrestadorSettings /> : <UserSettings />}
                </CardContent>
              </Card>
            </TabsContent>
            
            {isPrestador && <TabsContent value="bairros" className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="h-5 w-5 text-orange-500" />
                      Área de Atendimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GerenciadorBairros />
                  </CardContent>
                </Card>
              </TabsContent>}
            
            <TabsContent value="security" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-500" />
                    Privacidade & Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SecuritySettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>;
};
export default Settings;