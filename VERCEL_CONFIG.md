# Configuração Vercel - Zurbo

## Variáveis de Ambiente Necessárias

### ⚠️ IMPORTANTE: Configure estas variáveis na Vercel
Acesse: **Settings → Environment Variables** no projeto Vercel

### Variáveis para Frontend (VITE_*)
Estas variáveis são expostas no frontend (podem ser públicas):

- `VITE_SUPABASE_URL` = `https://mbzxifrkabfnufliawzo.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ienhpZnJrYWJmbnVmbGlhd3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzODA4NDQsImV4cCI6MjA2NTk1Njg0NH0.4xYcJE1QLgSUibpYWX0T_3JR2k5R8hQbxhrhre6WByg`

### Variáveis para Supabase Edge Functions (Secrets)
**NÃO configure na Vercel!** Configure no Supabase:
https://supabase.com/dashboard/project/mbzxifrkabfnufliawzo/functions/secrets

- `SUPABASE_URL` = `https://mbzxifrkabfnufliawzo.supabase.co`
- `SUPABASE_ANON_KEY` = (mesmo valor acima)
- `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ienhpZnJrYWJmbnVmbGlhd3pvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM4MDg0NCwiZXhwIjoyMDY1OTU2ODQ0fQ.TCmld_yiGi9YM4EKk9Qi7LrY7-T44Hq2fbK1JI8mApc`

### Outras Variáveis (se necessário)
- `VITE_STRIPE_PUBLIC_KEY` = (configurar se usar Stripe no frontend)
- `VITE_MAPBOX_ACCESS_TOKEN` = (configurar se usar Mapbox)

## Informações do Projeto

- **Projeto Supabase**: https://supabase.com/dashboard/project/mbzxifrkabfnufliawzo
- **Projeto Vercel**: https://vercel.com/zurbo
- **Email de Contato**: contato@zurbo.com.br
- **Repositório**: https://github.com/appZurbo/zurbo-app

## Como Configurar na Vercel

1. Acesse: https://vercel.com/zurbo/settings/environment-variables
2. Adicione cada variável `VITE_*` acima
3. Marque para todos os ambientes (Production, Preview, Development)
4. Clique em "Save"

## Segurança

✅ **PODE ser commitado no Git** (já está no código):
- Anon Key (chave pública, segura para frontend)

❌ **NÃO pode ser commitado** (já está protegido):
- Service Role Key (apenas no Supabase Secrets)
- Chaves secretas de APIs

