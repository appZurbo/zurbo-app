// Emergency toast replacement - no React hooks
import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// Simple function that doesn't use React hooks
export const useToast = () => {
  return { 
    toast: ({ title, description, variant }: ToastProps) => {
      const message = title || description || '';
      
      if (variant === 'destructive') {
        sonnerToast.error(message);
      } else {
        sonnerToast.success(message);
      }
    }
  };
};

export const toast = (props: ToastProps) => {
  const message = props.title || props.description || '';
  
  if (props.variant === 'destructive') {
    sonnerToast.error(message);
  } else {
    sonnerToast.success(message);
  }
};