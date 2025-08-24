#!/bin/bash

echo "🚀 Iniciando configuração mobile para Zurbo..."

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

echo "📱 Instalando Capacitor..."

# Instalar dependências do Capacitor se não estiverem instaladas
npm list @capacitor/core > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Instalando dependências do Capacitor..."
    npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android @capacitor/status-bar @capacitor/splash-screen
fi

# Inicializar Capacitor se não foi inicializado
if [ ! -f "capacitor.config.ts" ]; then
    echo "🔧 Inicializando Capacitor..."
    npx cap init zurbo-app app.lovable.2a4f188dfdf64c05bd20f93ac7af7de6 --web-dir=dist
fi

echo "📦 Fazendo build do projeto..."
npm run build

echo "🔄 Sincronizando Capacitor..."
npx cap sync

echo "📱 Para testar no dispositivo móvel:"
echo ""
echo "🍎 iOS:"
echo "  npx cap add ios"
echo "  npx cap run ios"
echo ""
echo "🤖 Android:"
echo "  npx cap add android" 
echo "  npx cap run android"
echo ""
echo "🌐 PWA:"
echo "  - Abra o app no navegador mobile"
echo "  - Toque em 'Instalar' quando aparecer o prompt"
echo "  - Ou adicione à tela inicial via menu do navegador"
echo ""
echo "✅ Configuração concluída!"