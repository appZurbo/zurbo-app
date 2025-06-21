
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  hasPermission: boolean | null;
  isLoading: boolean;
}

export const useSecureLocation = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    hasPermission: null,
    isLoading: false,
  });
  const { toast } = useToast();

  const requestLocation = useCallback((onConsentGranted?: () => void) => {
    setLocationState(prev => ({ ...prev, isLoading: true }));

    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive",
      });
      setLocationState(prev => ({ ...prev, isLoading: false, hasPermission: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          hasPermission: true,
          isLoading: false,
        });
        
        toast({
          title: "Localização obtida!",
          description: "Sua localização foi atualizada com sucesso.",
        });
        
        if (onConsentGranted) {
          onConsentGranted();
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Não foi possível obter sua localização.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permissão de localização negada.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Localização indisponível.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo limite para obter localização.";
            break;
        }
        
        toast({
          title: "Erro de localização",
          description: errorMessage,
          variant: "destructive",
        });
        
        setLocationState({
          latitude: null,
          longitude: null,
          hasPermission: false,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, [toast]);

  const clearLocation = useCallback(() => {
    setLocationState({
      latitude: null,
      longitude: null,
      hasPermission: false,
      isLoading: false,
    });
  }, []);

  return {
    ...locationState,
    requestLocation,
    clearLocation,
  };
};
