// ULTIMATE CACHE BREAKER - Wrapper for old toast API  
import { toast as sonnerToast } from 'sonner';

// Create a wrapper that handles both old and new API
function toast(options: any): void {
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

// Add sonner methods to the wrapper function
(toast as any).success = sonnerToast.success;
(toast as any).error = sonnerToast.error;
(toast as any).info = sonnerToast.info;
(toast as any).warning = sonnerToast.warning;

export { toast };

// Simple function that returns compatible toast API
export const useToast = () => ({ toast });

console.log('🚀 ULTIMATE CACHE BREAKER: Compatible toast wrapper v16.1');