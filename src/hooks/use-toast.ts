// CACHE-BREAKING PLACEHOLDER - NO HOOKS VERSION
// This file prevents browser cache errors without using any React hooks
import { toast } from 'sonner';

// Simple re-export without hooks
export { toast };

// Hook-free function that returns static object
export const useToast = () => {
  console.log('🔧 HOOK-FREE PLACEHOLDER: useToast called');
  
  // Return static object without useState - prevents React hook errors
  return { 
    toast: toast
  };
};

console.log('🔧 HOOK-FREE PLACEHOLDER: use-toast.ts loaded without React hooks');