// TEMPORARY PLACEHOLDER - This file was deleted but browser cache still references it
// This placeholder prevents the "Cannot read properties of null" error
import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  console.log('🔧 TEMPORARY PLACEHOLDER: toaster.tsx loaded to prevent cache errors');
  
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

export default Toaster;