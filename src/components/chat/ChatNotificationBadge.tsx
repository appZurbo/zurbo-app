
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useNavigate } from 'react-router-dom';
import { NotificationBadge } from '@/components/notifications/NotificationBadge';

export const ChatNotificationBadge = () => {
  const { unreadCount } = useRealtimeChat();
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/conversas');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="relative hover:bg-orange-50"
      onClick={handleChatClick}
    >
      <MessageCircle className="h-5 w-5 text-gray-600" />
      <NotificationBadge count={unreadCount} />
    </Button>
  );
};
