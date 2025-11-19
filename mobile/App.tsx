import React, { useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator, Alert, Platform, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Camera as CameraService } from './services/CameraService';
import { LocationService } from './services/LocationService';
import { NotificationService } from './services/NotificationService';

// Verificar se está rodando no web (não suportado)
if (Platform.OS === 'web') {
  console.warn('⚠️ Este app não suporta execução no navegador web.');
  console.warn('Por favor, use o Expo Go no seu dispositivo móvel.');
}

// URL do site em produção
const PRODUCTION_URL = 'https://www.zurbo.com.br';
// URL para desenvolvimento local
// const PRODUCTION_URL = 'http://192.168.0.18:8080';

// Configurar comportamento de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);

  // Mostrar mensagem se estiver tentando executar no web
  if (Platform.OS === 'web') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          ⚠️ Este aplicativo não pode ser executado no navegador web.
        </Text>
        <Text style={styles.errorSubtext}>
          Por favor, use o Expo Go no seu dispositivo móvel:
        </Text>
        <Text style={styles.instructions}>
          1. Execute: npm start{'\n'}
          2. Escaneie o QR Code com o Expo Go{'\n'}
          3. Ou pressione 'a' para Android ou 'i' para iOS
        </Text>
      </View>
    );
  }

  const reload = () => {
    setError(null);
    setLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  // Inicializar serviços nativos
  React.useEffect(() => {
    initializeNativeServices();
  }, []);

  const initializeNativeServices = async () => {
    try {
      // Solicitar permissões
      await LocationService.requestPermissions();
      await NotificationService.requestPermissions();
      
      // Configurar listeners para notificações
      NotificationService.setupListeners();
      
      console.log('Serviços nativos inicializados com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar serviços nativos:', error);
    }
  };

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('Erro no WebView:', nativeEvent);
    setLoading(false);
    setError(`Não foi possível carregar o site.\nErro: ${nativeEvent.description || 'Desconhecido'}\nCódigo: ${nativeEvent.code || 'N/A'}`);
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('Erro HTTP no WebView:', nativeEvent);
    // Ignorar erros de favicon ou assets não críticos se desejar, 
    // mas para o site principal, mostrar erro.
    if (nativeEvent.statusCode >= 400) {
       // Opcional: não bloquear totalmente se for um 404 de imagem, 
       // mas aqui vamos assumir erro de navegação principal por segurança no teste.
       // Melhore essa lógica se houver muitos 404s inofensivos.
    }
  };
  
  const handleRenderProcessGone = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('Processo de renderização falhou:', nativeEvent);
    setError('O processo de renderização da página falhou. Tente recarregar.');
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
  };

  // Handler para mensagens do JavaScript do site
  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'REQUEST_LOCATION':
          const location = await LocationService.getCurrentLocation();
          if (location && webViewRef.current) {
            const message = JSON.stringify({
              type: 'LOCATION_RESPONSE',
              data: location,
            });
            webViewRef.current.injectJavaScript(`
              (function() {
                if (window.zurboNative && window.zurboNative.onMessage) {
                  window.zurboNative.onMessage(${message});
                }
              })();
              true;
            `);
          }
          break;

        case 'REQUEST_CAMERA':
          const photo = await CameraService.takePicture();
          if (webViewRef.current) {
            const message = JSON.stringify({
              type: 'CAMERA_RESPONSE',
              data: photo,
            });
            webViewRef.current.injectJavaScript(`
              (function() {
                if (window.zurboNative && window.zurboNative.onMessage) {
                  window.zurboNative.onMessage(${message});
                }
              })();
              true;
            `);
          }
          break;

        case 'REQUEST_NOTIFICATION_PERMISSION':
          const permission = await NotificationService.requestPermissions();
          if (webViewRef.current) {
            const message = JSON.stringify({
              type: 'NOTIFICATION_PERMISSION_RESPONSE',
              granted: permission,
            });
            webViewRef.current.injectJavaScript(`
              (function() {
                if (window.zurboNative && window.zurboNative.onMessage) {
                  window.zurboNative.onMessage(${message});
                }
              })();
              true;
            `);
          }
          break;

        case 'SEND_NOTIFICATION':
          await NotificationService.scheduleNotification(data.title, data.body, data.data);
          break;

        default:
          console.log('Mensagem desconhecida:', data.type);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  };

  // JavaScript injetado no WebView para comunicação bidirecional
  const injectedJavaScript = `
    (function() {
      // O React Native WebView já expõe window.ReactNativeWebView.postMessage
      // Expor funções para o site usar
      window.zurboNative = {
        requestLocation: function() {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'REQUEST_LOCATION' }));
          }
        },
        requestCamera: function() {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'REQUEST_CAMERA' }));
          }
        },
        requestNotificationPermission: function() {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'REQUEST_NOTIFICATION_PERMISSION' }));
          }
        },
        sendNotification: function(title, body, data) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
              type: 'SEND_NOTIFICATION', 
              title, 
              body, 
              data 
            }));
          }
        },
        onMessage: null // Callback para receber mensagens do React Native
      };

      console.log('Zurbo Native Bridge inicializado');
    })();
    true; // nota: isso é necessário para iOS
  `;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent={false} backgroundColor="#ffffff" />
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ops! Algo deu errado.</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <Text style={styles.instructions}>Verifique sua conexão e tente novamente.</Text>
          <View style={{ marginTop: 20 }}>
            <Text onPress={reload} style={{ color: '#007AFF', fontSize: 18, padding: 10 }}>
              🔄 Tentar Novamente
            </Text>
          </View>
        </View>
      ) : (
        <>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}

          <WebView
            ref={webViewRef}
            source={{ uri: PRODUCTION_URL }}
            style={styles.webview}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            onHttpError={handleHttpError}
            onRenderProcessGone={handleRenderProcessGone}
            onNavigationStateChange={handleNavigationStateChange}
            onMessage={handleMessage}
            // MUDANÇA CRÍTICA: Injetar ANTES do conteúdo carregar
            injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
            // injectedJavaScript={injectedJavaScript} // Removido em favor do BeforeContent
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            allowsBackForwardNavigationGestures={true}
            // Configurações CRÍTICAS para compatibilidade
            originWhitelist={['*']} // Permitir navegação para qualquer lugar
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            mixedContentMode="always" // Permitir conteúdo misto (HTTP/HTTPS)
            thirdPartyCookiesEnabled={true}
            sharedCookiesEnabled={true}
            // Configurações para melhor performance e compatibilidade
            cacheEnabled={false} 
            incognito={false}
            // User agent simulando Chrome Mobile padrão para máxima compatibilidade
            userAgent={Platform.select({
              ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
              android: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
            })}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
