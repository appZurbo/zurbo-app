import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { AppointmentSystem } from '@/components/appointments/AppointmentSystem';
import { ServiceRequestHistory } from '@/components/client/ServiceRequestHistory';

const Pedidos = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = React.useState<'appointments' | 'requests'>('appointments');

  if (loading) {
    return (
      <UnifiedLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando pedidos...</p>
          </div>
        </div>
      </UnifiedLayout>
    );
  }

  if (!profile) {
    return (
      <UnifiedLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-none shadow-2xl rounded-[32px]">
            <CardContent className="p-8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-3xl flex items-center justify-center">
                <span className="font-black text-2xl">Z</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Acesso Restrito</h3>
              <p className="text-gray-500 font-medium">
                Você precisa estar logado para ver seus pedidos e solicitações.
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full bg-orange-500 hover:bg-orange-600 h-12 rounded-2xl font-bold mt-2">
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </UnifiedLayout>
    );
  }

  const isClient = profile.tipo !== 'prestador';

  return (
    <UnifiedLayout>
      <div className="min-h-screen bg-[#FDFDFD]">
        <div className={`${isMobile ? 'px-4 py-8' : 'max-w-6xl mx-auto p-12'}`}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                  Central de <span className="text-orange-500">Pedidos</span>
                </h1>
              </div>
              <p className="text-gray-500 font-medium ml-4">
                {profile.tipo === 'prestador'
                  ? 'Gerencie os pedidos recebidos de seus clientes'
                  : 'Acompanhe seus agendamentos de serviços e solicitações'}
              </p>
            </div>

            {isClient && (
              <div className="p-1 bg-gray-100 rounded-2xl flex gap-1 self-start md:self-auto">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('appointments')}
                  className={`rounded-xl px-6 h-10 font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'appointments' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}
                >
                  Agendamentos
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('requests')}
                  className={`rounded-xl px-6 h-10 font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'requests' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}
                >
                  Mapa (Abertos)
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8">
            {activeTab === 'appointments' ? (
              <AppointmentSystem />
            ) : (
              <ServiceRequestHistory userId={profile.id} />
            )}
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default Pedidos;