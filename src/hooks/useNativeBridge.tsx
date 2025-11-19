import { useState, useEffect } from 'react';

// Tipos para as mensagens da bridge
type NativeMessageType = 
  | 'LOCATION_RESPONSE' 
  | 'CAMERA_RESPONSE' 
  | 'NOTIFICATION_PERMISSION_RESPONSE';

interface NativeMessage {
  type: NativeMessageType;
  data?: any;
  granted?: boolean;
}

// Extensão da interface Window para incluir a propriedade zurboNative
declare global {
  interface Window {
    zurboNative?: {
      requestLocation: () => void;
      requestCamera: () => void;
      requestNotificationPermission: () => void;
      sendNotification: (title: string, body: string, data?: any) => void;
      onMessage: ((message: NativeMessage) => void) | null;
    };
  }
}

export const useNativeBridge = () => {
  const [isMobileApp, setIsMobileApp] = useState(false);

  useEffect(() => {
    // Verificar se está rodando no app mobile
    setIsMobileApp(typeof window !== 'undefined' && !!window.zurboNative);
  }, []);

  const requestLocation = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.zurboNative) {
        reject(new Error('Funcionalidade nativa não disponível'));
        return;
      }

      // Configurar listener para resposta única
      const originalOnMessage = window.zurboNative.onMessage;
      
      window.zurboNative.onMessage = (message: NativeMessage) => {
        if (message.type === 'LOCATION_RESPONSE') {
          resolve(message.data);
          // Restaurar listener original se existir
          window.zurboNative!.onMessage = originalOnMessage;
        } else if (originalOnMessage) {
          originalOnMessage(message);
        }
      };

      window.zurboNative.requestLocation();
    });
  };

  const requestCamera = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.zurboNative) {
        reject(new Error('Funcionalidade nativa não disponível'));
        return;
      }

      const originalOnMessage = window.zurboNative.onMessage;
      
      window.zurboNative.onMessage = (message: NativeMessage) => {
        if (message.type === 'CAMERA_RESPONSE') {
          if (message.data) {
            resolve(message.data);
          } else {
            reject(new Error('Captura de imagem cancelada ou falhou'));
          }
          window.zurboNative!.onMessage = originalOnMessage;
        } else if (originalOnMessage) {
          originalOnMessage(message);
        }
      };

      window.zurboNative.requestCamera();
    });
  };

  const requestNotificationPermission = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!window.zurboNative) {
        reject(new Error('Funcionalidade nativa não disponível'));
        return;
      }

      const originalOnMessage = window.zurboNative.onMessage;
      
      window.zurboNative.onMessage = (message: NativeMessage) => {
        if (message.type === 'NOTIFICATION_PERMISSION_RESPONSE') {
          resolve(!!message.granted);
          window.zurboNative!.onMessage = originalOnMessage;
        } else if (originalOnMessage) {
          originalOnMessage(message);
        }
      };

      window.zurboNative.requestNotificationPermission();
    });
  };

  const sendNotification = (title: string, body: string, data?: any) => {
    if (window.zurboNative) {
      window.zurboNative.sendNotification(title, body, data);
    }
  };

  return {
    isMobileApp,
    requestLocation,
    requestCamera,
    requestNotificationPermission,
    sendNotification
  };
};

