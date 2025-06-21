
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MapPin, Shield } from 'lucide-react';

interface LocationConsentDialogProps {
  open: boolean;
  onConsent: (granted: boolean) => void;
}

const LocationConsentDialog = ({ open, onConsent }: LocationConsentDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            Permissão de Localização
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Para melhor experiência no ZURBO, gostaríamos de acessar sua localização para:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Mostrar prestadores próximos a você</li>
              <li>Calcular distâncias e tempo de deslocamento</li>
              <li>Melhorar recomendações de serviços</li>
            </ul>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                Sua privacidade é importante. Você pode alterar essa preferência a qualquer momento nas configurações.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onConsent(false)}>
            Não Permitir
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => onConsent(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Permitir Localização
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LocationConsentDialog;
