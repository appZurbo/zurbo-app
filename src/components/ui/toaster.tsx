// ULTIMATE CACHE BREAKER - Pure component
import { Toaster as SonnerToaster } from 'sonner';

// Zero React hooks - pure JSX only
export function Toaster() {
  console.log('🚀 ULTIMATE CACHE BREAKER: Toaster v16.0 - Zero hooks');
  
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