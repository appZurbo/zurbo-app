// Completely new notification system to bypass cache
import { toast } from 'sonner';

interface NotificationProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const showNotification = (props: NotificationProps) => {
  const message = props.title || props.description || '';
  
  if (props.variant === 'destructive') {
    toast.error(message);
  } else {
    toast.success(message);
  }
};

export const useNotifications = () => {
  return { 
    showNotification: (props: NotificationProps) => showNotification(props)
  };
};