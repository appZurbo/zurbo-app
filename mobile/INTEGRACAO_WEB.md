# Guia de Integração - Funcionalidades Nativas no Site Web

Este documento explica como integrar as funcionalidades nativas do app mobile no site web do Zurbo.

## 🔌 Verificação de Ambiente

Primeiro, verifique se o código está rodando no app mobile:

```javascript
// Verificar se está no app mobile
const isMobileApp = typeof window.zurboNative !== 'undefined';

if (isMobileApp) {
  console.log('Rodando no app mobile - funcionalidades nativas disponíveis');
} else {
  console.log('Rodando no navegador - usando APIs web padrão');
}
```

## 📍 Geolocalização

### No App Mobile (usando funcionalidade nativa)

```javascript
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (window.zurboNative) {
      // App mobile - usar funcionalidade nativa
      window.zurboNative.onMessage = function(data) {
        if (data.type === 'LOCATION_RESPONSE') {
          resolve(data.data);
        }
      };
      window.zurboNative.requestLocation();
    } else {
      // Navegador - usar Geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          (error) => reject(error)
        );
      } else {
        reject(new Error('Geolocalização não suportada'));
      }
    }
  });
}

// Uso
getCurrentLocation()
  .then(location => {
    console.log('Localização:', location);
    // Usar localização para buscar prestadores próximos
  })
  .catch(error => {
    console.error('Erro ao obter localização:', error);
  });
```

## 📷 Câmera

### No App Mobile (usando funcionalidade nativa)

```javascript
function takePicture() {
  return new Promise((resolve, reject) => {
    if (window.zurboNative) {
      // App mobile - usar câmera nativa
      window.zurboNative.onMessage = function(data) {
        if (data.type === 'CAMERA_RESPONSE') {
          if (data.data) {
            resolve(data.data);
          } else {
            reject(new Error('Foto cancelada'));
          }
        }
      };
      window.zurboNative.requestCamera();
    } else {
      // Navegador - usar input file
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Câmera traseira no mobile
      
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              uri: event.target.result,
              file: file,
            });
          };
          reader.readAsDataURL(file);
        } else {
          reject(new Error('Nenhuma imagem selecionada'));
        }
      };
      
      input.click();
    }
  });
}

// Uso
takePicture()
  .then(photo => {
    console.log('Foto capturada:', photo);
    // Enviar foto para o servidor
    uploadPhoto(photo);
  })
  .catch(error => {
    console.error('Erro ao capturar foto:', error);
  });
```

## 🔔 Notificações Push

### No App Mobile (usando notificações nativas)

```javascript
async function requestNotificationPermission() {
  if (window.zurboNative) {
    // App mobile - usar permissão nativa
    return new Promise((resolve) => {
      window.zurboNative.onMessage = function(data) {
        if (data.type === 'NOTIFICATION_PERMISSION_RESPONSE') {
          resolve(data.granted);
        }
      };
      window.zurboNative.requestNotificationPermission();
    });
  } else {
    // Navegador - usar Notification API
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
}

async function sendNotification(title, body, data = {}) {
  if (window.zurboNative) {
    // App mobile - usar notificação nativa
    window.zurboNative.sendNotification(title, body, data);
  } else {
    // Navegador - usar Notification API
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/logo.png',
        data: data,
      });
    }
  }
}

// Uso
async function setupNotifications() {
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    // Enviar notificação quando um novo pedido chegar
    sendNotification(
      'Novo Pedido',
      'Você recebeu um novo pedido de serviço',
      { orderId: '123' }
    );
  }
}
```

## 🎯 Exemplo Completo: Componente React

```typescript
import React, { useEffect, useState } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function LocationButton() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    
    if (window.zurboNative) {
      // App mobile
      window.zurboNative.onMessage = (data: any) => {
        if (data.type === 'LOCATION_RESPONSE') {
          setLocation(data.data);
          setLoading(false);
        }
      };
      window.zurboNative.requestLocation();
    } else {
      // Navegador
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
            setLoading(false);
          },
          (error) => {
            console.error('Erro ao obter localização:', error);
            setLoading(false);
          }
        );
      }
    }
  };

  return (
    <div>
      <button onClick={getLocation} disabled={loading}>
        {loading ? 'Obtendo localização...' : 'Obter Minha Localização'}
      </button>
      {location && (
        <p>
          Lat: {location.latitude}, Lng: {location.longitude}
        </p>
      )}
    </div>
  );
}
```

## 🔄 Padrão de Fallback

Sempre implemente um fallback para quando as funcionalidades nativas não estiverem disponíveis:

```javascript
// Helper function para detectar ambiente
function isMobileApp() {
  return typeof window.zurboNative !== 'undefined';
}

// Helper function para funcionalidades com fallback
const NativeFeatures = {
  location: {
    get: () => {
      if (isMobileApp()) {
        // Usar funcionalidade nativa
        return getNativeLocation();
      } else {
        // Usar API web
        return getWebLocation();
      }
    }
  },
  
  camera: {
    takePicture: () => {
      if (isMobileApp()) {
        return takeNativePicture();
      } else {
        return takeWebPicture();
      }
    }
  },
  
  notifications: {
    requestPermission: () => {
      if (isMobileApp()) {
        return requestNativeNotificationPermission();
      } else {
        return requestWebNotificationPermission();
      }
    }
  }
};

// Uso
const location = await NativeFeatures.location.get();
```

## 📝 Notas Importantes

1. **Sempre verifique disponibilidade**: Use `typeof window.zurboNative !== 'undefined'` antes de chamar funções nativas
2. **Trate erros**: Implemente tratamento de erro para ambos os casos (nativo e web)
3. **Teste em ambos ambientes**: Certifique-se de que funciona tanto no app quanto no navegador
4. **Permissões**: No app mobile, as permissões são solicitadas automaticamente. No navegador, você precisa solicitar manualmente
5. **Performance**: Funcionalidades nativas geralmente têm melhor performance e UX

## 🚀 Próximos Passos

Para adicionar mais funcionalidades nativas:

1. Adicione o handler no `App.tsx` do app mobile
2. Exponha a função no `window.zurboNative`
3. Implemente o fallback no site web
4. Documente o uso neste guia

