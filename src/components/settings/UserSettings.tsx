
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Bell, MapPin, User, Crown, Palette, Camera } from 'lucide-react';
import { LocationSettings } from '@/components/location/LocationSettings';
import { ProfileTab } from './ProfileTab';
import { NotificationTab } from './NotificationTab';
import { SecurityTabContent } from './SecurityTabContent';
import { PrestadorPhotoSettings } from './PrestadorPhotoSettings';
import { useMobile } from '@/hooks/useMobile';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const UserSettings = () => {
  const isMobile = useMobile();
  const { isPrestador, isAdmin, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className={`w-full ${isMobile ? 'px-0' : 'max-w-4xl mx-auto'}`}>
      <Card className={`${isMobile ? 'border-0 shadow-none bg-transparent' : ''}`}>
        <CardHeader className={`${isMobile ? 'px-0 pb-4' : ''}`}>
          <div className="flex items-center gap-4">
            {/* Profile Avatar Section for Providers */}
            {isPrestador && (
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile?.foto_url} alt={profile?.nome} />
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xl">
                    {profile?.nome?.charAt(0)?.toUpperCase() || 'P'}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-gray-600 text-center">Foto de Perfil</p>
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className={`${isMobile ? 'text-lg' : 'text-2xl'}`}>
                    Configurações da Conta
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    Gerencie suas informações pessoais e preferências
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className={`${isMobile ? 'px-0 py-0' : ''}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-4 h-auto' : isPrestador ? 'grid-cols-6' : 'grid-cols-4'} mb-8`}>
              <TabsTrigger value="profile" className={`flex items-center gap-1 ${isMobile ? 'flex-col text-xs px-1 py-2' : 'gap-2'}`}>
                <User className="h-4 w-4" />
                <span>{isMobile ? 'Perfil' : 'Perfil'}</span>
              </TabsTrigger>
              <TabsTrigger value="location" className={`flex items-center gap-1 ${isMobile ? 'flex-col text-xs px-1 py-2' : 'gap-2'}`}>
                <MapPin className="h-4 w-4" />
                <span>{isMobile ? 'Local' : 'Local'}</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className={`flex items-center gap-1 ${isMobile ? 'flex-col text-xs px-1 py-2' : 'gap-2'}`}>
                <Bell className="h-4 w-4" />
                <span>{isMobile ? 'Notif' : 'Notificações'}</span>
              </TabsTrigger>
              <TabsTrigger value="security" className={`flex items-center gap-1 ${isMobile ? 'flex-col text-xs px-1 py-2' : 'gap-2'}`}>
                <Shield className="h-4 w-4" />
                <span>{isMobile ? 'Segur' : 'Segurança'}</span>
              </TabsTrigger>
              {isPrestador && (
                <>
                  <TabsTrigger value="photos" className={`flex items-center gap-1 ${isMobile ? 'flex-col text-xs px-1 py-2' : 'gap-2'}`}>
                    <Camera className="h-4 w-4" />
                    <span>{isMobile ? 'Fotos' : 'Fotos'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className={`flex items-center gap-1 ${isMobile ? 'flex-col text-xs px-1 py-2' : 'gap-2'}`}>
                    <Palette className="h-4 w-4" />
                    <span>{isMobile ? 'Pref' : 'Preferências'}</span>
                  </TabsTrigger>
                </>
              )}
              {isAdmin && !isPrestador && (
                <TabsTrigger value="preferences" className={`flex items-center gap-1 ${isMobile ? 'flex-col text-xs px-1 py-2' : 'gap-2'}`}>
                  <Palette className="h-4 w-4" />
                  <span>{isMobile ? 'Pref' : 'Preferências'}</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <ProfileTab />
            </TabsContent>

            <TabsContent value="location" className="mt-6">
              <LocationSettings />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <NotificationTab />
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <SecurityTabContent />
            </TabsContent>

            {isPrestador && (
              <TabsContent value="photos" className="mt-6">
                <PrestadorPhotoSettings />
              </TabsContent>
            )}

            {(isPrestador || isAdmin) && (
              <TabsContent value="preferences" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      Preferências Avançadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isPrestador && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">Configurações do Prestador</h3>
                        <div className="grid gap-4">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Disponibilidade</h4>
                            <p className="text-sm text-gray-600">
                              Configure seus horários de atendimento e dias disponíveis
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Preços Automáticos</h4>
                            <p className="text-sm text-gray-600">
                              Defina preços padrão para seus serviços mais comuns
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {isAdmin && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">Configurações de Administrador</h3>
                        <div className="grid gap-4">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Moderação Automática</h4>
                            <p className="text-sm text-gray-600">
                              Configure filtros automáticos para conteúdo inadequado
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Relatórios Personalizados</h4>
                            <p className="text-sm text-gray-600">
                              Defina modelos de relatório personalizados
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
