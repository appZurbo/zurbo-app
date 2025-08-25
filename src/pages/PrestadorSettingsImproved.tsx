
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { 
  User, 
  Settings, 
  MapPin, 
  Star, 
  Image,
  ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import components
import { PrestadorPhotoSettings } from '@/components/settings/PrestadorPhotoSettings';
import { ServiceSelectionImproved } from '@/components/settings/ServiceSelectionImproved';
import GerenciadorCidades from '@/components/cidades/GerenciadorCidades';
import { PortfolioUpload } from '@/components/prestador/PortfolioUpload';

const PrestadorSettingsImproved = () => {
  const { profile, loading } = useAuth();
  const isMobile = useMobile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  if (loading) {
    return (
      <UnifiedLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
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

  if (!profile || profile.tipo !== 'prestador') {
    return (
      <UnifiedLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Você precisa estar logado como prestador para acessar esta página.
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
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
              Configurações do Prestador
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Configure seu perfil e serviços oferecidos
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} mb-6`}>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {!isMobile && "Perfil"}
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {!isMobile && "Serviços"}
            </TabsTrigger>
            <TabsTrigger value="areas" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {!isMobile && "Áreas"}
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              {!isMobile && "Fotos"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  Informações do Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Para editar informações básicas do perfil, use a página de configurações principal.
                  </p>
                  <Button 
                    onClick={() => navigate('/prestador-settings')}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Ir para Configurações Básicas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServiceSelectionImproved />
          </TabsContent>

          <TabsContent value="areas" className="space-y-6">
            <GerenciadorCidades />
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <PrestadorPhotoSettings />
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
};

export default PrestadorSettingsImproved;
