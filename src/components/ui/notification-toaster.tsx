// NEW TOASTER v56 - Pure Sonner component
import { Toaster } from "sonner";

export function NotificationToaster() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
    />
  );
}

export default NotificationToaster;