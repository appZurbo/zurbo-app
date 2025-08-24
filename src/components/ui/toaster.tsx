// CACHE BUSTER v55 - Pure Sonner toaster
import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
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