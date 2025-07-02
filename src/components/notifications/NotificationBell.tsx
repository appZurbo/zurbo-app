
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications } from '@/hooks/useNotifications';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useNavigate } from 'react-router-dom';
import { NotificationBadge } from './NotificationBadge';
import { NotificationPanel } from './NotificationPanel';

export const NotificationBell = () => {
  const { unreadCount: notificationCount } = useNotifications();
  const { unreadCount: chatCount } = useRealtimeChat();
  const navigate = useNavigate();

  const totalCount = notificationCount + chatCount;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-orange-50"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <NotificationBadge count={totalCount} />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0 z-50" 
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <NotificationPanel />
      </PopoverContent>
    </Popover>
  );
};
