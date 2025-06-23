import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Wrench, Image, Bell, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ServiceSelectionPage from '@/components/services/ServiceSelectionPage';
import { PortfolioUpload } from '@/components/prestador/PortfolioUpload';
import { NotificationSettings } from '@/components/prestador/NotificationSettings';
import { LocationSettings } from '@/components/location/LocationSettings';
const PrestadorSettings = () => {
  const navigate = useNavigate();
  const {
    profile,
    isPrestador
  } = useAuth();
  const [activeTab, setActiveTab] = useState('services');
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
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 py-0 px-0">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Configurações do Prestador
            </h1>
            <p className="text-gray-600">
              Gerencie seus serviços, localização, portfólio e configurações
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localização
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Portfólio
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
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