import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Bell, MapPin, User } from 'lucide-react';
import { LocationSettings } from '@/components/location/LocationSettings';
import { ProfileTab } from './ProfileTab';
import { NotificationTab } from './NotificationTab';
import { SecurityTabContent } from './SecurityTabContent';
import { useMobile } from '@/hooks/useMobile';
export const UserSettings = () => {
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState('profile');
  return <div className={`w-full ${isMobile ? 'px-0' : 'max-w-4xl mx-auto'}`}>
      <Card className={`${isMobile ? 'border-0 shadow-none bg-transparent' : ''}`}>
        <CardHeader className={`${isMobile ? 'px-0 pb-4' : ''}`}>
          <CardTitle className={`${isMobile ? 'text-lg' : ''}`}>      Configurações da Conta</CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? 'px-0 py-0' : ''}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-[5px]">
            <TabsList className={`grid grid-cols-4 w-full ${isMobile ? 'h-12 mb-6' : ''}`}>
              <TabsTrigger value="profile" className={`flex items-center gap-1 ${isMobile ? 'text-xs px-2' : 'gap-2'}`}>
                <User className="h-4 w-4" />
                <span className={`${isMobile ? 'hidden sm:inline' : ''}`}>Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="location" className={`flex items-center gap-1 ${isMobile ? 'text-xs px-2' : 'gap-2'}`}>
                <MapPin className="h-4 w-4" />
                <span className={`${isMobile ? 'hidden sm:inline' : ''}`}>Local</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className={`flex items-center gap-1 ${isMobile ? 'text-xs px-2' : 'gap-2'}`}>
                <Bell className="h-4 w-4" />
                <span className={`${isMobile ? 'hidden sm:inline' : ''}`}>Notif</span>
              </TabsTrigger>
              <TabsTrigger value="security" className={`flex items-center gap-1 ${isMobile ? 'text-xs px-2' : 'gap-2'}`}>
                <Shield className="h-4 w-4" />
                <span className={`${isMobile ? 'hidden sm:inline' : ''}`}>Segur</span>
              </TabsTrigger>
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
          </Tabs>
        </CardContent>
      </Card>
    </div>;
};