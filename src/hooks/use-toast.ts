// EMERGENCY CACHE BREAKER - Simple re-export only
import { toast } from 'sonner';

// No hooks version - just re-export
export { toast };

// Simple function that returns toast directly
export const useToast = () => ({ toast });

console.log('✅ CACHE BREAKER: use-toast v15.0 loaded');