# 📧 Configuração SMTP HostGator - Zurbo

**Data de Criação:** 02/12/2025  
**Email:** noreply@zurbo.com.br  
**Domínio:** zurbo.com.br  
**Hospedagem:** HostGator Brasil

---

## 🔧 Configurações SMTP da HostGator

Com base nas suas configurações DNS, aqui estão os valores corretos para configurar no Supabase:

### 📋 Valores para Configuração no Supabase

```
✅ Enable Custom SMTP: [ATIVAR]

📧 Sender email: noreply@zurbo.com.br

👤 Sender name: Zurbo
   (ou "Equipe Zurbo" - nome que aparece como remetente)

🔗 SMTP host: mail.zurbo.com.br
   (ou br884.hostgator.com.br - ambos funcionam)

🔌 SMTP port: 587
   (TLS/STARTTLS - recomendado) ou 465 (SSL)

🔐 SMTP user: noreply@zurbo.com.br
   (email completo que você criou na HostGator)

🔑 SMTP password: [SENHA DO EMAIL]
   (senha da conta noreply@zurbo.com.br criada no cPanel)

🔒 SMTP security: STARTTLS
   (se porta 587) ou SSL (se porta 465)
```

---

## 📝 Passo a Passo - Configuração no Supabase

### Opção A: Configuração Automática via Script (Recomendado)

**⚠️ Requer:** Access Token do Supabase (obtenha em: https://supabase.com/dashboard/account/tokens)

#### Windows (PowerShell):
```powershell
# Execute o script com seu Access Token
.\configurar-smtp-supabase.ps1 -AccessToken "seu-access-token" -SmtpPassword "senha-do-email"
```

#### Linux/Mac (Bash):
```bash
# Dê permissão de execução (primeira vez)
chmod +x configurar-smtp-supabase.sh

# Execute o script com seu Access Token
./configurar-smtp-supabase.sh "seu-access-token" "senha-do-email"
```

**Nota:** Se você não fornecer a senha no script, precisará configurá-la manualmente no Dashboard.

---

### Opção B: Configuração Manual no Dashboard

#### 1. Acessar Configurações de Autenticação

1. Acesse: https://supabase.com/dashboard/project/mbzxifrkabfnufliawzo/auth/providers
2. Ou navegue: **Authentication** → **Settings** → **SMTP Settings**

#### 2. Preencher os Campos

1. **Enable Custom SMTP**: ✅ Ativar
2. **Sender email**: `noreply@zurbo.com.br`
3. **Sender name**: `Zurbo`
4. **SMTP host**: `mail.zurbo.com.br`
5. **SMTP port**: `587`
6. **SMTP user**: `noreply@zurbo.com.br`
7. **SMTP password**: `[SENHA DO EMAIL]` (senha da conta criada no cPanel)
8. **SMTP security**: `STARTTLS`

#### 3. Salvar e Testar

1. Clique em **Save**
2. Teste criando um novo usuário de teste
3. Verifique se o email chega de `noreply@zurbo.com.br`

---

## 🔍 Verificações Importantes

### ✅ Configurações DNS (Já Configuradas)

Baseado nas suas configurações DNS fornecidas:

- ✅ **SPF**: `v=spf1 include:spf.titan.email ~all` (configurado)
- ✅ **DKIM**: `titan1._domainkey` e `default._domainkey` (configurados)
- ✅ **MX Records**: `mx1.titan.email` e `mx2.titan.email` (configurados)
- ✅ **A Record**: `mail.zurbo.com.br` → `108.167.132.238` (configurado)

### ⚠️ Observações

1. **Servidor SMTP**: 
   - `mail.zurbo.com.br` (recomendado - usa o registro A)
   - `br884.hostgator.com.br` (alternativa - servidor direto)

2. **Porta**:
   - `587` (STARTTLS) - **Recomendado** para maior compatibilidade
   - `465` (SSL) - Alternativa se 587 não funcionar

3. **Autenticação**:
   - Use o email completo (`noreply@zurbo.com.br`) como usuário
   - Use a senha da conta de email criada no cPanel da HostGator

---

## 🧪 Teste de Configuração

### Teste 1: Confirmação de Cadastro

1. Crie um novo usuário no seu app
2. Verifique se o email de confirmação chega
3. Verifique se o remetente é `noreply@zurbo.com.br`

### Teste 2: Redefinição de Senha

1. Use "Esqueci minha senha" no seu app
2. Verifique se o email chega corretamente
3. Verifique se os links funcionam

### Teste 3: Reenvio de Confirmação

1. Use a função de reenvio de email de confirmação
2. Verifique se o email chega

---

## ⚠️ Problemas Comuns e Soluções

### Problema 1: "Connection timeout" ou "Could not connect"

**Soluções:**
- Verifique se a porta está correta (587 ou 465)
- Tente alternar entre `mail.zurbo.com.br` e `br884.hostgator.com.br`
- Verifique se o firewall da HostGator permite conexões externas na porta SMTP
- Tente usar SSL (porta 465) ao invés de STARTTLS (porta 587)

### Problema 2: "Authentication failed"

**Soluções:**
- Confirme que o email `noreply@zurbo.com.br` existe no cPanel
- Verifique se a senha está correta
- Use o email completo como usuário (`noreply@zurbo.com.br`)
- Verifique se a conta de email está ativa no cPanel

### Problema 3: Emails vão para spam

**Soluções:**
- ✅ SPF já está configurado
- ✅ DKIM já está configurado
- Configure DMARC (opcional, mas recomendado):
  ```
  TXT _dmarc.zurbo.com.br
  v=DMARC1; p=quarantine; rua=mailto:contato@zurbo.com.br
  ```
- Use um nome de remetente mais amigável (ex: "Zurbo" ao invés de "noreply")
- Evite palavras como "noreply" no remetente (já está usando "Zurbo" como nome)

### Problema 4: "Email address not authorized"

**Solução:**
- No Supabase Dashboard, vá em **Team** → **Members**
- Adicione o email de teste à lista de membros (apenas para testes)
- Ou configure o SMTP customizado (que você está fazendo agora)

---

## 🔐 Segurança e Boas Práticas

### ✅ Já Implementado

- ✅ SPF configurado
- ✅ DKIM configurado
- ✅ Email dedicado para automação (`noreply@zurbo.com.br`)

### 📋 Recomendações Adicionais

1. **DMARC** (Opcional mas recomendado):
   - Adicione um registro TXT `_dmarc.zurbo.com.br` no DNS
   - Valor: `v=DMARC1; p=quarantine; rua=mailto:contato@zurbo.com.br`

2. **Senha Forte**:
   - Use uma senha forte para a conta `noreply@zurbo.com.br`
   - Não compartilhe esta senha

3. **Monitoramento**:
   - Monitore a taxa de entrega de emails
   - Verifique logs no Supabase Dashboard se houver problemas

---

## 📚 Referências

- [Documentação Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [HostGator Email Setup](https://www.hostgator.com.br/ajuda/artigos/como-configurar-email-no-outlook)
- [SPF, DKIM e DMARC](https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/)

---

## ✅ Checklist de Configuração

- [x] Conta de email `noreply@zurbo.com.br` criada no cPanel HostGator
- [x] Senha da conta de email anotada (segura)
- [x] **SMTP configurado no Supabase** ✅ (02/12/2025)
- [ ] Teste de email de confirmação realizado
- [ ] Teste de redefinição de senha realizado
- [ ] Emails chegando corretamente (verificar spam)
- [ ] Remetente aparecendo como "Zurbo <noreply@zurbo.com.br>"

### ✅ Status da Configuração (Verificado em 02/12/2025)

- ✅ **SMTP Customizado**: Habilitado
- ✅ **Email Remetente**: noreply@zurbo.com.br
- ✅ **SMTP Host**: mail.zurbo.com.br
- ✅ **SMTP Porta**: 587 (STARTTLS)
- ✅ **SMTP Usuário**: noreply@zurbo.com.br
- ✅ **Nome Remetente**: Zurbo
- ✅ **Senha SMTP**: Configurada

---

## 🎯 Próximos Passos Após Configurar SMTP

1. **Personalizar Templates de Email**:
   - Acesse: Authentication → Email Templates
   - Personalize os templates de confirmação, redefinição de senha, etc.
   - Adicione logo e cores da Zurbo

2. **Implementar E-mails Transacionais**:
   - Criar Edge Functions para confirmação de pedidos
   - Criar Edge Functions para notificações
   - Usar Resend ou outro serviço para e-mails transacionais customizados

---

**Última Atualização:** 02/12/2025

