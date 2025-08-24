// EMERGENCY CACHE BREAKER - No hooks component
import { Toaster as SonnerToaster } from 'sonner';

// Simple component with no React hooks
export function Toaster() {
  console.log('✅ CACHE BREAKER: Toaster v15.0 rendered');
  
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
    />
  );
}

export default Toaster;