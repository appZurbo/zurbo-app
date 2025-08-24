# 📱 Configuração Mobile - Zurbo

Este projeto agora suporta **PWA (Progressive Web App)** e **Capacitor** para experiência móvel nativa.

## 🎯 O que foi implementado

### ✅ PWA (Progressive Web App)
- **Manifest.json**: Configuração para instalação na tela inicial
- **Service Worker**: Cache offline e performance
- **Meta tags iOS**: Suporte completo para Safari/iOS
- **Ícones**: 192x192 e 512x512 gerados automaticamente
- **Prompt de instalação**: Aparece automaticamente em dispositivos móveis

### ✅ Capacitor (App Nativo)
- **Configuração completa**: iOS e Android
- **Status Bar**: Personalizada com cores do app
- **Splash Screen**: Tela de carregamento com branding
- **Hot reload**: Desenvolvimento direto do sandbox
- **Build nativo**: Pronto para App Store e Google Play

## 🚀 Como usar

### PWA - Testando agora
1. Abra o app no seu celular
2. Aguarde o prompt "Instalar Zurbo" aparecer
3. Toque em "Instalar"
4. O app será adicionado à tela inicial sem barra de navegador

### Capacitor - App Nativo Completo

#### Preparação (Uma vez)
```bash
# 1. Clone o projeto do GitHub
git clone [seu-repo]
cd zurbo-app

# 2. Instale dependências
npm install

# 3. Execute o script de configuração
chmod +x scripts/install-mobile.sh
./scripts/install-mobile.sh
```

#### Para iOS (requer Mac + Xcode)
```bash
npx cap add ios
npx cap update ios
npm run build
npx cap sync
npx cap run ios
```

#### Para Android (requer Android Studio)
```bash
npx cap add android
npx cap update android
npm run build
npx cap sync
npx cap run android
```

## 🎨 Recursos Móveis

### PWA
- ✅ Instalação sem App Store
- ✅ Funciona offline (cache básico)
- ✅ Remove barra do navegador
- ✅ Ícone na tela inicial
- ✅ Splash screen automática
- ✅ Tema escuro/claro automático

### Capacitor
- ✅ App nativo real
- ✅ Acesso a APIs nativas
- ✅ Distribuível nas lojas
- ✅ Performance nativa
- ✅ Push notifications (futuro)
- ✅ Câmera/GPS nativo (futuro)

## 🔧 Desenvolvimento

### Hot Reload Mobile
O projeto está configurado para hot reload direto do sandbox:
- URL: `https://2a4f188d-fdf6-4c05-bd20-f93ac7af7de6.lovableproject.com`
- Mudanças aparecem instantaneamente no app nativo

### Builds
```bash
# PWA (automático)
npm run build

# Capacitor sync (após mudanças)
npx cap sync

# Build para produção
npm run build && npx cap sync
```

## 📊 Status

| Recurso | PWA | Capacitor |
|---------|-----|-----------|
| Instalação | ✅ | ✅ |
| Offline | ✅ | ✅ |
| Nativo | ❌ | ✅ |
| App Stores | ❌ | ✅ |
| Performance | 🟡 | ✅ |
| APIs Nativas | ❌ | ✅ |

## 🐛 Troubleshooting

### PWA não instala
- Verifique se está usando HTTPS
- Limpe cache do navegador
- Tente em modo anônimo

### Capacitor não funciona
- Verifique se `npm run build` foi executado
- Execute `npx cap sync` após mudanças
- Verifique logs: `npx cap run [platform] --verbose`

### iOS não abre
- Certifique-se que tem Xcode instalado
- Execute `npx cap update ios`
- Verifique certificados de desenvolvedor

---

## 📚 Próximos Passos

1. **Teste PWA**: Abra no celular e instale
2. **Configure nativo**: Siga instruções do Capacitor
3. **Personalize**: Ajuste ícones e splash screen
4. **Publique**: Submeta para App Store/Google Play

**🔗 Blog post completo**: https://lovable.dev/blogs/TODO