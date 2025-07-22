
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';

const NotificacoesPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isMobile = useMobile();

  if (!profile) {
    return (
      <UnifiedLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Você precisa estar logado para ver suas notificações.
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
      <div className="w-full">
        <div className={`w-full ${isMobile ? 'px-4 py-4' : 'px-6 py-6'}`}>
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
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                    Notificações
                  </h1>
                  <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                    Acompanhe suas mensagens e atualizações
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="flex justify-center">
            <NotificationPanel />
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default NotificacoesPage;
