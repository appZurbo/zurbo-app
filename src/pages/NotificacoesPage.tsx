
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { useMobile } from '@/hooks/useMobile';

const NotificacoesPage = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  return (
    <UnifiedLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {!isMobile && 'Voltar'}
          </Button>
          <div className="flex-1">
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              Notificações
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Acompanhe suas notificações
            </p>
          </div>
        </div>

        {/* Conteúdo das notificações seria implementado aqui */}
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma notificação no momento</p>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default NotificacoesPage;
