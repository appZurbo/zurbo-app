
import { Toaster as SonnerToaster } from "sonner";

// Clean implementation without hooks
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
