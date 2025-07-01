
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useNavigate } from 'react-router-dom';
import { NotificationBadge } from './NotificationBadge';

export const NotificationBell = () => {
  const { unreadCount: notificationCount } = useNotifications();
  const { unreadCount: chatCount } = useRealtimeChat();
  const navigate = useNavigate();

  const totalCount = notificationCount + chatCount;

  const handleNotificationClick = () => {
    navigate('/notificacoes');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="relative hover:bg-orange-50"
      onClick={handleNotificationClick}
    >
      <Bell className="h-5 w-5 text-gray-600" />
      <NotificationBadge count={totalCount} />
    </Button>
  );
};
