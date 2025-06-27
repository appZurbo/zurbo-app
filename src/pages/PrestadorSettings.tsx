import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Wrench, Image, Bell, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import ServiceSelectionPage from '@/components/services/ServiceSelectionPage';
import { PortfolioUpload } from '@/components/prestador/PortfolioUpload';
import { NotificationSettings } from '@/components/prestador/NotificationSettings';
import { LocationSettings } from '@/components/location/LocationSettings';
import { OnDutyToggle } from '@/components/provider/OnDutyToggle';
import { EmergencyButton } from '@/components/emergency/EmergencyButton';
const PrestadorSettings = () => {
  const navigate = useNavigate();
  const {
    profile,
    isPrestador
  } = useAuth();
  const [activeTab, setActiveTab] = useState('services');
  const isMobile = useMobile();
  if (!isPrestador) {
    return <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600 mb-4">
              Esta página é exclusiva para prestadores de serviços.
            </p>
            <Button onClick={() => navigate('/')}>
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-6xl mx-auto p-4'}`}>
        {/* Header melhorado para mobile */}
        <div className={`flex items-center gap-3 mb-6 ${isMobile ? 'sticky top-0 bg-gray-50 py-2 z-10' : ''}`}>
          <Button variant="ghost" onClick={() => navigate('/')} className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {!isMobile && 'Voltar'}
          </Button>
          <div className="flex-1 text-center">
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              Configurações do Prestador
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Gerencie seus serviços, localização, portfólio e configurações
            </p>
          </div>
          {/* Espaço vazio para balancear o layout */}
          <div className={`${isMobile ? 'w-10' : 'w-20'}`}></div>
        </div>

        {/* Status Em Serviço */}
        <OnDutyToggle />

        {/* Botão SOS Emergência */}
        

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`${isMobile ? 'grid grid-cols-2 gap-2 h-auto p-2' : 'grid grid-cols-4'} w-full ${isMobile ? 'max-w-full' : 'max-w-2xl'}`}>
            <TabsTrigger value="services" className={`flex items-center gap-2 ${isMobile ? 'flex-col p-3 h-auto' : ''}`}>
              <Wrench className="h-4 w-4" />
              <span className={`${isMobile ? 'text-xs' : ''}`}>Serviços</span>
            </TabsTrigger>
            <TabsTrigger value="location" className={`flex items-center gap-2 ${isMobile ? 'flex-col p-3 h-auto' : ''}`}>
              <MapPin className="h-4 w-4" />
              <span className={`${isMobile ? 'text-xs' : ''}`}>Localização</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className={`flex items-center gap-2 ${isMobile ? 'flex-col p-3 h-auto' : ''}`}>
              <Image className="h-4 w-4" />
              <span className={`${isMobile ? 'text-xs' : ''}`}>Portfólio</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className={`flex items-center gap-2 ${isMobile ? 'flex-col p-3 h-auto' : ''}`}>
              <Bell className="h-4 w-4" />
              <span className={`${isMobile ? 'text-xs' : ''}`}>Notificações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ServiceSelectionPage onComplete={() => {}} />
          </TabsContent>

          <TabsContent value="location">
            <LocationSettings />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioUpload />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default PrestadorSettings;