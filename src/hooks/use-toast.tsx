
// Simple toast without React hooks - direct Sonner integration
import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// No hooks - just direct function calls
export const toast = (props: ToastProps) => {
  const message = props.title || props.description || '';
  
  if (props.variant === 'destructive') {
    sonnerToast.error(message);
  } else {
    sonnerToast.success(message);
  }
};

// Export a function that returns toast (no useState hook)
export const useToast = () => {
  return { toast };
};
