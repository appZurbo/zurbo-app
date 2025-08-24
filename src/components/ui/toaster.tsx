import { simpleToast, useToast } from "@/utils/simpleToast";
// Compatibility imports - not actually used, but prevents import errors
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  // Sistema simples sem hooks React - retorna null
  // O toast é renderizado diretamente no DOM via simpleToast
  return null;
}
