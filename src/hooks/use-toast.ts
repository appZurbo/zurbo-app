// ULTIMATE CACHE BREAKER - Properly typed toast wrapper
import { toast as sonnerToast } from 'sonner';

interface ToastInterface {
  (options: any): void;
  success: typeof sonnerToast.success;
  error: typeof sonnerToast.error;
  info: typeof sonnerToast.info;
  warning: typeof sonnerToast.warning;
}

// Create the main toast function
function toastFunction(options: any): void {
  if (typeof options === 'string') {
    sonnerToast.success(options);
  } else if (options && typeof options === 'object') {
    const message = options.title || options.description || 'Notification';
    if (options.variant === 'destructive') {
      sonnerToast.error(message, { description: options.description !== options.title ? options.description : undefined });
    } else {
      sonnerToast.success(message, { description: options.description !== options.title ? options.description : undefined });
    }
  }
}

// Create the toast object with methods
const toast = toastFunction as ToastInterface;
toast.success = sonnerToast.success;
toast.error = sonnerToast.error;
toast.info = sonnerToast.info;
toast.warning = sonnerToast.warning;

export { toast };

// Simple function that returns compatible toast API
export const useToast = () => ({ toast });

console.log('🚀 ULTIMATE CACHE BREAKER: Properly typed toast wrapper v17.0');