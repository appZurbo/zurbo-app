// Simple toast implementation without React hooks
import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// Simple function without hooks
export const useToast = () => {
  const toast = ({ title, description, variant }: ToastProps) => {
    const message = title || description || '';
    
    if (variant === 'destructive') {
      sonnerToast.error(message);
    } else {
      sonnerToast.success(message);
    }
  };

  return { toast };
};

// Direct toast function
export const toast = (props: ToastProps) => {
  const message = props.title || props.description || '';
  
  if (props.variant === 'destructive') {
    sonnerToast.error(message);
  } else {
    sonnerToast.success(message);
  }
};