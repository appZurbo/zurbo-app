# Correção: Erro redirect_uri_mismatch - Google OAuth

## 🔴 Problema

Erro `400: redirect_uri_mismatch` ao tentar fazer login com Google.

## ✅ Solução

O Supabase usa sua própria URL de callback para OAuth. Esta URL **DEVE** estar configurada no Google Cloud Console.

### URL de Callback do Supabase:
```
https://mbzxifrkabfnufliawzo.supabase.co/auth/v1/callback
```

## 📋 Passo a Passo para Corrigir

### 1. Acesse o Google Cloud Console
- URL: https://console.cloud.google.com/apis/credentials
- Selecione seu projeto

### 2. Edite a Credencial OAuth 2.0
- Clique na credencial "Web Zurbo" (ou o nome que você deu)
- Role até "URIs de redirecionamento autorizadas"

### 3. Adicione a URL do Supabase
**Adicione EXATAMENTE esta URL:**
```
https://mbzxifrkabfnufliawzo.supabase.co/auth/v1/callback
```

### 4. Verifique as URLs Configuradas
Você deve ter estas URLs na lista:

**URIs de redirecionamento autorizadas:**
```
https://mbzxifrkabfnufliawzo.supabase.co/auth/v1/callback
```

**Origens JavaScript autorizadas:**
```
https://zurbo.com.br
https://www.zurbo.com.br
http://localhost:8080
http://localhost:3000
http://localhost:5173
```

### 5. Salve as Alterações
- Clique em "Salvar" (Save)
- Aguarde alguns minutos para a propagação

## ⚠️ Importante

- A URL do Supabase (`/auth/v1/callback`) é **obrigatória** e **diferente** da URL da sua aplicação
- O `redirectTo` no código é para onde o usuário vai DEPOIS do callback do Supabase
- Não confunda as duas URLs!

## 🧪 Como Testar

1. Aguarde 2-5 minutos após salvar no Google Cloud Console
2. Tente fazer login com Google novamente
3. Deve funcionar sem o erro `redirect_uri_mismatch`

## 🔗 Links Úteis

- **Google Cloud Console - Credentials**: https://console.cloud.google.com/apis/credentials
- **Supabase Auth Providers**: https://supabase.com/dashboard/project/mbzxifrkabfnufliawzo/auth/providers
