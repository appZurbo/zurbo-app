// CACHE-BREAKING PLACEHOLDER - NO HOOKS VERSION
// This component prevents browser cache errors without using React hooks
import { Toaster as SonnerToaster } from 'sonner';

// Simple component without any hooks
export function Toaster() {
  console.log('🔧 HOOK-FREE PLACEHOLDER: Toaster rendered without React hooks');
  
  // Return Sonner toaster directly without using any React hooks
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      className="toaster group"
    />
  );
}

// Default export for compatibility
export default Toaster;