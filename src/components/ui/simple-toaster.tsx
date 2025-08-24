// Simple toaster without hooks
import { Toaster } from "sonner";

export function SimpleToaster() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
    />
  );
}