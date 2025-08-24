import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// Helper function to convert old toast format to Sonner format
export function toast(props: ToastProps | string) {
  if (typeof props === 'string') {
    return sonnerToast.success(props);
  }
  
  const message = props.title || props.description || 'Notification';
  
  if (props.variant === 'destructive') {
    return sonnerToast.error(message);
  } else {
    return sonnerToast.success(message);
  }
}

// Export individual methods for direct use
toast.success = (message: string) => sonnerToast.success(message);
toast.error = (message: string) => sonnerToast.error(message);
toast.info = (message: string) => sonnerToast.info(message);
toast.warning = (message: string) => sonnerToast.warning(message);