import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { AppointmentSystem } from '@/components/appointments/AppointmentSystem';
import WatermarkSection from '@/components/sections/WatermarkSection';

const Pedidos = () => {
  const navigate = useNavigate();
  const {
    profile,
    loading
  } = useAuth();
  const isMobile = useMobile();

  if (loading) {
    return <UnifiedLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando pedidos...</p>
          </div>
        </div>
      </UnifiedLayout>;
  }

  if (!profile) {
    return <UnifiedLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Você precisa estar logado para ver seus pedidos.
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full">
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </UnifiedLayout>;
  }

  return <UnifiedLayout>
      <div className="w-full">
        <div className={`w-full ${isMobile ? 'px-4 py-4' : 'px-6 py-6'}`}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            
            <div className="flex-1">
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                {profile.tipo === 'prestador' ? 'Meus Pedidos' : 'Meus Agendamentos'}
              </h1>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                {profile.tipo === 'prestador' ? 'Gerencie os pedidos recebidos de clientes' : 'Acompanhe seus agendamentos de serviços'}
              </p>
            </div>
          </div>

          {/* Appointment System */}
          <AppointmentSystem />
        </div>
      </div>
      
      <WatermarkSection />
    </UnifiedLayout>;
};

export default Pedidos;
