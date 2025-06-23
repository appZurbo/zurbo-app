
import { Bell, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { useNavigate } from 'react-router-dom';

export const NotificationPanel = () => {
  const { recentNotifications, unreadCount, loading, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Carregando notificações...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <span className="text-sm text-gray-500">({unreadCount} não lidas)</span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Marcar todas
          </Button>
        )}
      </div>
      
      <ScrollArea className="max-h-96">
        {recentNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>Nenhuma notificação</p>
            <p className="text-xs mt-1">Suas notificações aparecerão aqui</p>
          </div>
        ) : (
          <div className="divide-y">
            {recentNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </ScrollArea>
      
      {recentNotifications.length > 0 && (
        <>
          <Separator />
          <div className="p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notificacoes')}
              className="w-full justify-center text-sm text-orange-600 hover:text-orange-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver todas as notificações
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
