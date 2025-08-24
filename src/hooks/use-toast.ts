// CACHE BUSTER v55 - Zero hooks toast system
import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'destructive' | 'default';
}

// Main toast function that can be called directly
function createToast(message: string | ToastOptions) {
  if (typeof message === 'string') {
    return sonnerToast.success(message);
  } else if (message && typeof message === 'object') {
    const text = message.title || message.description || 'Notification';
    if (message.variant === 'destructive') {
      return sonnerToast.error(text, { description: message.description !== message.title ? message.description : undefined });
    } else {
      return sonnerToast.success(text, { description: message.description !== message.title ? message.description : undefined });
    }
  }
}

// Create callable toast object with methods
export const toast = Object.assign(createToast, {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  info: (message: string) => sonnerToast.info(message),
  warning: (message: string) => sonnerToast.warning(message),
});

// Legacy compatibility function - no hooks used
export const useToast = () => ({ toast });