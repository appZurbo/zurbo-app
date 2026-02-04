#!/bin/bash
# Script Bash para Configurar SMTP no Supabase via Management API
# Requer: Access Token do Supabase (obtenha em https://supabase.com/dashboard/account/tokens)

set -e

PROJECT_REF="mbzxifrkabfnufliawzo"
API_URL="https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth"

# Verificar se o Access Token foi fornecido
if [ -z "$1" ]; then
    echo "❌ Erro: Access Token não fornecido"
    echo ""
    echo "Uso: ./configurar-smtp-supabase.sh <ACCESS_TOKEN> [SMTP_PASSWORD]"
    echo ""
    echo "Obtenha seu Access Token em: https://supabase.com/dashboard/account/tokens"
    exit 1
fi

ACCESS_TOKEN=$1
SMTP_PASSWORD=${2:-""}

echo "🔧 Configurando SMTP no Supabase..."
echo "📧 Email: noreply@zurbo.com.br"
echo "🔗 Host: mail.zurbo.com.br"
echo "🔌 Porta: 587 (STARTTLS)"
echo ""

# Criar JSON de configuração
JSON_CONFIG=$(cat <<EOF
{
  "external_email_enabled": true,
  "mailer_secure_email_change_enabled": true,
  "mailer_autoconfirm": false,
  "smtp_admin_email": "noreply@zurbo.com.br",
  "smtp_host": "mail.zurbo.com.br",
  "smtp_port": 587,
  "smtp_user": "noreply@zurbo.com.br",
  "smtp_sender_name": "Zurbo"
}
EOF
)

# Se a senha foi fornecida, adiciona ao JSON
if [ -n "$SMTP_PASSWORD" ]; then
    JSON_CONFIG=$(echo "$JSON_CONFIG" | jq --arg pass "$SMTP_PASSWORD" '. + {smtp_pass: $pass}')
fi

# Fazer a requisição
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$JSON_CONFIG")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 204 ]; then
    echo "✅ SMTP configurado com sucesso!"
    echo ""
    echo "📋 Configurações aplicadas:"
    echo "   - Sender: Zurbo <noreply@zurbo.com.br>"
    echo "   - Host: mail.zurbo.com.br"
    echo "   - Porta: 587"
    echo "   - Security: STARTTLS"
    echo ""
    echo "🧪 Próximo passo: Teste criando um novo usuário no seu app"
else
    echo "❌ Erro ao configurar SMTP (HTTP $HTTP_CODE)"
    echo "Resposta: $BODY"
    echo ""
    echo "💡 Dicas:"
    echo "   1. Verifique se o Access Token está correto"
    echo "   2. Verifique se você tem permissões para modificar o projeto"
    echo "   3. Tente obter um novo token em: https://supabase.com/dashboard/account/tokens"
    exit 1
fi

