// TEMPORARY PLACEHOLDER - This file was deleted but browser cache still references it
// This placeholder prevents the "Cannot read properties of null" error
import { toast } from 'sonner';

// Re-export toast for backward compatibility during transition
export { toast };

// Placeholder hook for cached references
export const useToast = () => {
  return { 
    toast: {
      success: toast.success,
      error: toast.error,
      info: toast.info,
      warning: toast.warning
    }
  };
};

console.log('🔧 TEMPORARY PLACEHOLDER: use-toast.ts loaded to prevent cache errors');