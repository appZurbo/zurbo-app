// PURE TOASTER - NO HOOKS AT ALL
import { Toaster } from "sonner";

export const PureToaster = () => (
  <Toaster
    position="top-right"
    expand={false}
    richColors
    closeButton
  />
);