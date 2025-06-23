
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Star, MessageCircle, User, Settings, DollarSign, Calendar, Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'new_client' | 'new_review' | 'new_message' | 'system_update' | 'payment' | 'schedule_change';
  read: boolean;
  created_at: string;
  metadata?: {
    pedido_id?: string;
    chat_id?: string;
    user_name?: string;
    service_name?: string;
  };
}

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();

  const getIcon = () => {
    switch (notification.type) {
      case 'new_client':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'new_review':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'new_message':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'schedule_change':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'system_update':
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'new_message':
        if (notification.metadata?.chat_id) {
          navigate('/conversas');
        }
        break;
      case 'new_client':
      case 'schedule_change':
        if (notification.metadata?.pedido_id) {
          navigate('/pedidos');
        }
        break;
      case 'payment':
        navigate('/pedidos');
        break;
      default:
        break;
    }
  };

  const getTypeLabel = () => {
    switch (notification.type) {
      case 'new_client':
        return 'Novo Cliente';
      case 'new_review':
        return 'Nova Avaliação';
      case 'new_message':
        return 'Nova Mensagem';
      case 'payment':
        return 'Pagamento';
      case 'schedule_change':
        return 'Agenda';
      case 'system_update':
        return 'Sistema';
      default:
        return 'Notificação';
    }
  };

  return (
    <div
      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </p>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {getTypeLabel()}
            </span>
          </div>
          <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
            {notification.message}
          </p>
          {notification.metadata?.user_name && (
            <p className="text-xs text-gray-500 mt-1">
              De: {notification.metadata.user_name}
            </p>
          )}
          {notification.metadata?.service_name && (
            <p className="text-xs text-gray-500 mt-1">
              Serviço: {notification.metadata.service_name}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: ptBR,
            })}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
        )}
      </div>
    </div>
  );
};
