// Completely hook-free toaster - NO REACT HOOKS AT ALL
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