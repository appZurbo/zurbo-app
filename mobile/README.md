# Zurbo Mobile App

Aplicativo mobile do Zurbo construído com Expo e React Native.

## 📱 Sobre o App

Este aplicativo utiliza uma abordagem híbrida com WebView, carregando o site www.zurbo.com.br e fornecendo acesso a funcionalidades nativas do dispositivo através de uma bridge JavaScript.

## 🚀 Funcionalidades Implementadas

- ✅ **WebView**: Carrega o site Zurbo em produção
- ✅ **Geolocalização**: Acesso à localização do usuário
- ✅ **Câmera**: Tirar fotos e selecionar da galeria
- ✅ **Notificações Push**: Sistema de notificações nativas
- 🔄 **Bridge JavaScript**: Comunicação bidirecional entre web e nativo

## 📋 Pré-requisitos

- Node.js instalado (versão 18 ou superior)
- Expo CLI instalado globalmente (opcional, mas recomendado)
- Expo Go instalado no seu celular:
  - [Android - Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

## 🛠️ Instalação

1. Navegue até a pasta mobile:
```bash
cd mobile
```

2. Instale as dependências:
```bash
npm install
```

## 🏃 Como Executar

### Desenvolvimento (com Expo Go)

1. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
npx expo start
```

2. Escaneie o QR Code:
   - **Android**: Abra o Expo Go e toque em "Scan QR Code"
   - **iOS**: Abra a câmera e toque na notificação que aparece

3. O app será carregado no seu dispositivo!

### Outras opções de execução:

```bash
# Executar no Android (requer emulador ou dispositivo conectado)
npm run android

# Executar no iOS (requer Mac e Xcode)
npm run ios

# Executar no navegador (para testes)
npm run web
```

## 🔧 Configuração

### Alterar URL do Site

Edite o arquivo `App.tsx` e altere a constante `PRODUCTION_URL`:

```typescript
const PRODUCTION_URL = 'https://www.zurbo.com.br';
```

Para desenvolvimento local, você pode usar:
```typescript
const DEV_URL = 'http://192.168.1.X:8080'; // Substitua X pelo IP da sua máquina
```

**Importante**: Certifique-se de que seu computador e celular estão na mesma rede Wi-Fi.

### Configurar Project ID do EAS (para Push Notifications)

1. Crie uma conta no [Expo](https://expo.dev)
2. Instale o EAS CLI:
```bash
npm install -g eas-cli
```

3. Faça login:
```bash
eas login
```

4. Configure o projeto:
```bash
eas init
```

5. Atualize o `app.json` com o project ID gerado:
```json
"extra": {
  "eas": {
    "projectId": "seu-project-id-aqui"
  }
}
```

## 📱 Funcionalidades Nativas

### Como usar no Site Web

O app expõe um objeto `window.zurboNative` no site que pode ser usado para acessar funcionalidades nativas:

#### Geolocalização

```javascript
// Solicitar localização atual
window.zurboNative.requestLocation();

// Escutar resposta
window.zurboNative.onMessage = function(data) {
  if (data.type === 'LOCATION_RESPONSE') {
    console.log('Localização:', data.data);
    // { latitude: -23.5505, longitude: -46.6333, ... }
  }
};
```

#### Câmera

```javascript
// Abrir câmera
window.zurboNative.requestCamera();

// Escutar resposta
window.zurboNative.onMessage = function(data) {
  if (data.type === 'CAMERA_RESPONSE') {
    console.log('Foto:', data.data);
    // { uri: 'file://...', width: 1920, height: 1080, ... }
  }
};
```

#### Notificações

```javascript
// Solicitar permissão
window.zurboNative.requestNotificationPermission();

// Enviar notificação
window.zurboNative.sendNotification(
  'Título',
  'Mensagem da notificação',
  { customData: 'valor' }
);
```

## 🏗️ Estrutura do Projeto

```
mobile/
├── App.tsx                 # Componente principal com WebView
├── app.json                # Configurações do Expo
├── package.json            # Dependências
├── services/               # Serviços nativos
│   ├── CameraService.ts    # Serviço de câmera
│   ├── LocationService.ts  # Serviço de localização
│   └── NotificationService.ts # Serviço de notificações
└── README.md              # Este arquivo
```

## 📦 Build para Produção

### Android (APK)

```bash
eas build --platform android --profile preview
```

### iOS (IPA)

```bash
eas build --platform ios --profile preview
```

**Nota**: Para builds de produção, você precisará configurar credenciais no EAS. Veja a [documentação do Expo](https://docs.expo.dev/build/introduction/).

## 🔐 Permissões

O app solicita as seguintes permissões:

- **Câmera**: Para tirar fotos de serviços e perfil
- **Localização**: Para encontrar prestadores próximos
- **Notificações**: Para receber atualizações sobre serviços
- **Galeria**: Para selecionar fotos existentes

Todas as permissões são solicitadas apenas quando necessário e podem ser negadas pelo usuário.

## 🐛 Troubleshooting

### App não carrega o site

- Verifique sua conexão com a internet
- Confirme que a URL em `PRODUCTION_URL` está correta
- Verifique se o site está acessível no navegador

### Notificações não funcionam

- Certifique-se de estar usando um dispositivo físico (não emulador)
- Verifique se as permissões foram concedidas
- Configure o Project ID do EAS no `app.json`

### Câmera não abre

- Verifique se as permissões foram concedidas
- Teste em um dispositivo físico (emuladores podem ter limitações)

### QR Code não funciona

- Certifique-se de que o celular e computador estão na mesma rede Wi-Fi
- Tente usar o modo "Tunnel" do Expo: `npx expo start --tunnel`

## 📚 Recursos Úteis

- [Documentação do Expo](https://docs.expo.dev/)
- [Documentação do React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [Documentação do EAS Build](https://docs.expo.dev/build/introduction/)

## 🤝 Contribuindo

Para adicionar novas funcionalidades nativas:

1. Crie um novo serviço em `services/`
2. Adicione o handler no `App.tsx` no método `handleMessage`
3. Exponha a função no `window.zurboNative` no JavaScript injetado
4. Documente o uso no README

## 📄 Licença

Este projeto faz parte do Zurbo App.

