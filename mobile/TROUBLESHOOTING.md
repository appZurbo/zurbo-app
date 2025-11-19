# 🔧 Troubleshooting - Resolução de Problemas

## 🌐 Site não carrega ou Tela de Erro

Se o site `www.zurbo.com.br` não estiver carregando no app, verifique:

### 1. Detalhes do Erro na Tela

Com a atualização recente, o app agora mostra o motivo do erro na tela.
- **Erro de conexão:** Verifique se o celular tem acesso à internet.
- **Erro SSL/TLS:** Pode haver problema com o certificado do site.
- **Erro HTTP (404, 500):** O site pode estar fora do ar ou a página não existe.

### 2. Acesso ao Site

Tente abrir `https://www.zurbo.com.br` no **navegador do celular** (Chrome/Safari).
- Se não abrir no navegador do celular, o problema é na conexão do celular ou no site.
- Se abrir no navegador mas não no app, pode ser algum bloqueio específico.

### 3. Limpar Cache do App

Às vezes o WebView guarda cache antigo.
- No Android: Configurações > Apps > Expo Go > Armazenamento > Limpar Cache e Dados.
- No iOS: Reinstale o Expo Go.

## ❌ Erro: "Failed to load resource: index.ts.bundle"

### Causa
O Expo está tentando executar no modo **web** (navegador).

### ✅ Solução

1. **Pare todos os processos:** `Ctrl+C`
2. **Limpe o cache:**
```bash
cd mobile
npx expo start --clear
```
3. **Execute:** `npm start` (NÃO use npm run web)
4. **No celular:** Escaneie o QR Code com o Expo Go.

## 📱 Como Executar Corretamente

### Opção 1: Expo Go no Celular (Recomendado)

1. Abra o terminal na pasta `mobile`:
```bash
cd mobile
```

2. Limpe o cache e inicie:
```bash
npx expo start --clear
```

3. Escaneie o QR Code:
   - **Android**: Abra o Expo Go → "Scan QR Code"
   - **iOS**: Abra a Câmera → Toque na notificação

### Opção 2: Emulador Android

1. Certifique-se de ter o Android Studio instalado
2. Inicie um emulador Android
3. Execute:
```bash
cd mobile
npx expo start --android
```

## 🚫 O que NÃO fazer

❌ **NÃO execute:** `npm run web` ou `npx expo start --web`
❌ **NÃO abra no navegador automaticamente**

## 🔄 Limpar Cache Completamente

Se ainda tiver problemas, limpe tudo:

```bash
cd mobile
npm cache clean --force
# Windows PowerShell
Remove-Item -Recurse -Force node_modules
npm install
npx expo start --clear
```
