import { useAuth } from '@/hooks/useAuth';
import WatermarkSection from '@/components/sections/WatermarkSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings as SettingsIcon, User, Wrench, Shield, FileText, Camera, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserSettings } from '@/components/settings/UserSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import { ProviderProfileSection } from '@/components/settings/ProviderProfileSection';
import { ServiceSelectionImproved } from '@/components/settings/ServiceSelectionImproved';
import { PrestadorPhotoSettings } from '@/components/settings/PrestadorPhotoSettings';
import GerenciadorCidades from '@/components/cidades/GerenciadorCidades';
import { useMobile } from '@/hooks/useMobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { LegalDocumentsTab } from '@/components/settings/LegalDocumentsTab';
import { useNativeBridge } from "@/hooks/useNativeBridge";

const Settings = () => {
  const navigate = useNavigate();
  const { profile, isPrestador, isAuthenticated, loading } = useAuth();
  const isMobile = useMobile();
  const { isMobileApp, requestCamera, requestLocation } = useNativeBridge();

  // Função de teste rápido para Mobile
  const handleMobileTest = async (type: 'camera' | 'location') => {
    if (type === 'camera') {
      try {
        const photo = await requestCamera();
        alert('Foto capturada! ' + (photo.uri ? 'Sucesso' : 'Sem dados'));
      } catch (e) {
        alert('Erro câmera: ' + e);
      }
    } else {
      try {
        const loc = await requestLocation();
        alert(`GPS: ${loc.latitude}, ${loc.longitude}`);
      } catch (e) {
        alert('Erro GPS: ' + e);
      }
    }
  };

  if (loading) {
    return (
      <UnifiedLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando configurações...</p>
          </div>
        </div>
      </UnifiedLayout>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <UnifiedLayout>
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
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout>
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && 'Voltar'}
            </Button>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <SettingsIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                    Configurações
                  </h1>
                  <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''} flex items-center gap-2`}>
                    {isPrestador ? (
                      <>
                        <Wrench className="h-4 w-4" />
                        Painel do Prestador
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4" />
                        Perfil do Cliente
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PAINEL DE TESTE MOBILE - SÓ APARECE NO APP */}
          {isMobileApp && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                📱 Teste de Funcionalidades Nativas
              </h3>
              <div className="flex gap-2">
                <Button onClick={() => handleMobileTest('camera')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Camera className="mr-2 h-4 w-4" /> Testar Câmera
                </Button>
                <Button onClick={() => handleMobileTest('location')} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <MapPin className="mr-2 h-4 w-4" /> Testar GPS
                </Button>
              </div>
              <p className="text-xs text-blue-600 mt-2 text-center">
                Use estes botões para verificar se a integração nativa está funcionando.
              </p>
            </div>
          )}

          {/* Tabs organizadas centralmente */}
          <div className="max-w-2xl mx-auto">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className={`grid w-full ${isPrestador ? 'grid-cols-4' : 'grid-cols-3'} bg-white shadow-sm`}>
                <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
                  <User className="h-4 w-4" />
                  {isMobile ? 'Perfil' : 'Meu Perfil'}
                </TabsTrigger>
                {isPrestador && (
                   <TabsTrigger value="services" className="flex items-center gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
                     <Wrench className="h-4 w-4" />
                     {isMobile ? 'Serviços' : 'Configurações de Serviços'}
                   </TabsTrigger>
                )}
                <TabsTrigger value="security" className="flex items-center gap-0.5 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
                  <Shield className="h-4 w-4" />
                  {isMobile ? 'Segurança' : 'Privacidade & Segurança'}
                </TabsTrigger>
                <TabsTrigger value="legal" className="flex items-center gap-0.5 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
                  <FileText className="h-4 w-4" />
                  {isMobile ? 'Contrato' : 'Meu Contrato'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                {isPrestador ? (
                  <div className="space-y-6">
                    <ProviderProfileSection />
                    <PrestadorPhotoSettings />
                  </div>
                ) : (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5 text-orange-500" />
                        Informações Pessoais
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <UserSettings />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
               {isPrestador && (
                 <TabsContent value="services" className="space-y-6">
                   <div className="space-y-6">
                     <ServiceSelectionImproved />
                     <Card className="shadow-sm">
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <SettingsIcon className="h-5 w-5 text-orange-500" />
                           Área de Atendimento
                         </CardTitle>
                       </CardHeader>
                       <CardContent>
                         <GerenciadorCidades />
                       </CardContent>
                     </Card>
                   </div>
                 </TabsContent>
               )}
              
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

              <TabsContent value="legal" className="space-y-6">
                <LegalDocumentsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <WatermarkSection />
    </UnifiedLayout>
  );
};

export default Settings;
