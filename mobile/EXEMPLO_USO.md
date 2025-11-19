# Exemplo de Uso - Como Testar o App Mobile

## 🚀 Passo a Passo Rápido

### 1. Preparar o Ambiente

```bash
# Navegar para a pasta mobile
cd mobile

# Instalar dependências (se ainda não instalou)
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento

```bash
npm start
# ou
npx expo start
```

Você verá algo assim:

```
› Metro waiting on exp://192.168.1.X:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

### 3. Conectar com o Expo Go

#### No Android:
1. Abra o app **Expo Go** no seu celular
2. Toque em **"Scan QR Code"**
3. Escaneie o QR Code que apareceu no terminal
4. Aguarde o app carregar

#### No iOS:
1. Abra o app **Câmera** do iPhone
2. Aponte para o QR Code no terminal
3. Toque na notificação que aparece
4. O Expo Go abrirá automaticamente

### 4. Testar Funcionalidades

Uma vez que o app carregar, você verá o site www.zurbo.com.br dentro do app.

#### Testar no Console do Navegador (WebView)

Para testar as funcionalidades nativas, você precisa acessar o console do WebView. Infelizmente, isso não é direto, mas você pode:

1. **Adicionar botões de teste no site** (temporariamente)
2. **Usar o React Native Debugger** (mais avançado)

#### Exemplo de Código para Adicionar no Site (Temporário)

Adicione este código no console do navegador ou em uma página de teste:

```javascript
// Verificar se está no app mobile
if (typeof window.zurboNative !== 'undefined') {
  console.log('✅ App mobile detectado!');
  
  // Configurar listener para respostas
  window.zurboNative.onMessage = function(data) {
    console.log('📨 Resposta recebida:', data);
    
    switch(data.type) {
      case 'LOCATION_RESPONSE':
        console.log('📍 Localização:', data.data);
        alert(`Localização: ${data.data.latitude}, ${data.data.longitude}`);
        break;
        
      case 'CAMERA_RESPONSE':
        console.log('📷 Foto:', data.data);
        if (data.data) {
          alert('Foto capturada! URI: ' + data.data.uri);
        } else {
          alert('Foto cancelada');
        }
        break;
        
      case 'NOTIFICATION_PERMISSION_RESPONSE':
        console.log('🔔 Permissão:', data.granted);
        alert('Permissão de notificação: ' + (data.granted ? 'Concedida' : 'Negada'));
        break;
    }
  };
  
  // Criar botões de teste
  const testDiv = document.createElement('div');
  testDiv.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;background:white;padding:10px;border:2px solid #007AFF;border-radius:8px;';
  testDiv.innerHTML = `
    <h3 style="margin:0 0 10px 0;color:#007AFF;">Teste Funcionalidades</h3>
    <button onclick="window.zurboNative.requestLocation()" style="display:block;width:100%;margin:5px 0;padding:8px;background:#007AFF;color:white;border:none;border-radius:4px;">📍 Localização</button>
    <button onclick="window.zurboNative.requestCamera()" style="display:block;width:100%;margin:5px 0;padding:8px;background:#007AFF;color:white;border:none;border-radius:4px;">📷 Câmera</button>
    <button onclick="window.zurboNative.requestNotificationPermission()" style="display:block;width:100%;margin:5px 0;padding:8px;background:#007AFF;color:white;border:none;border-radius:4px;">🔔 Notificação</button>
    <button onclick="window.zurboNative.sendNotification('Teste', 'Esta é uma notificação de teste!', {test: true})" style="display:block;width:100%;margin:5px 0;padding:8px;background:#007AFF;color:white;border:none;border-radius:4px;">📤 Enviar Notificação</button>
  `;
  document.body.appendChild(testDiv);
  
} else {
  console.log('❌ Não está no app mobile - funcionalidades nativas não disponíveis');
}
```

## 🧪 Testando Cada Funcionalidade

### 📍 Testar Geolocalização

1. Clique no botão "📍 Localização"
2. Permita o acesso à localização quando solicitado
3. Você verá um alerta com suas coordenadas

### 📷 Testar Câmera

1. Clique no botão "📷 Câmera"
2. Permita o acesso à câmera quando solicitado
3. Tire uma foto ou selecione da galeria
4. Você verá um alerta com a URI da foto

### 🔔 Testar Notificações

1. Clique no botão "🔔 Notificação" para solicitar permissão
2. Permita as notificações quando solicitado
3. Clique em "📤 Enviar Notificação" para testar
4. Você verá uma notificação nativa aparecer

## 🐛 Troubleshooting

### App não carrega

- Verifique sua conexão com a internet
- Certifique-se de que www.zurbo.com.br está acessível
- Tente recarregar: pressione `r` no terminal do Expo

### QR Code não funciona

- Certifique-se de que celular e computador estão na mesma rede Wi-Fi
- Tente usar o modo tunnel: `npx expo start --tunnel`
- Reinicie o Expo Go no celular

### Funcionalidades não respondem

- Verifique o console do Expo para erros
- Certifique-se de que as permissões foram concedidas
- Verifique se o código JavaScript foi injetado corretamente (abra o DevTools se possível)

### Notificações não aparecem

- Certifique-se de estar usando um dispositivo físico (não emulador)
- Verifique as configurações de notificação do dispositivo
- Teste em um dispositivo Android primeiro (iOS pode ter restrições adicionais)

## 📱 Modo de Desenvolvimento vs Produção

### Desenvolvimento (atual)
- Carrega www.zurbo.com.br (produção)
- Funcionalidades nativas disponíveis
- Hot reload ativo

### Para testar com site local

1. Descubra o IP da sua máquina na rede local:
   - Windows: `ipconfig` (procure por IPv4)
   - Mac/Linux: `ifconfig` ou `ip addr`

2. Edite `App.tsx` e altere:
```typescript
const PRODUCTION_URL = 'http://192.168.1.X:8080'; // Seu IP aqui
```

3. Certifique-se de que o servidor web está rodando na porta 8080
4. Reinicie o Expo

## 🎯 Próximos Passos

1. Integrar as funcionalidades nativas no site web
2. Adicionar mais funcionalidades conforme necessário
3. Preparar para build de produção
4. Configurar push notifications com servidor backend

