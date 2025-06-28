
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationPanel } from './NotificationPanel';
import { useNavigate } from 'react-router-dom';

export const NotificationBell = () => {
  const { hasNewMessages } = useNotifications();
  const navigate = useNavigate();

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
      {hasNewMessages && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-2 w-2 p-0 flex items-center justify-center animate-pulse"
        />
      )}
    </Button>
  );
};
