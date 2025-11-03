# Configuração DNS Completa para zurbo.com.br na Vercel

## 📋 Análise dos Registros Atuais

### ✅ REGISTROS QUE DEVEM SER MANTIDOS (Email e Serviços)

Estes registros são essenciais para email funcionar. **NÃO APAGUE:**

#### 1. Registros MX (Email)
```
MX  zurbo.com.br.  →  mx1.titan.email  (Prioridade: 10)
MX  zurbo.com.br.  →  mx2.titan.email  (Prioridade: 20)
```
**Manter:** ✅ Essencial para receber emails

#### 2. Registros TXT (SPF e DKIM para Email)
```
TXT  zurbo.com.br.  →  "v=spf1 include:spf.titan.email ~all"
TXT  titan1._domainkey.zurbo.com.br.  →  (seu valor DKIM)
TXT  default._domainkey.zurbo.com.br.  →  (seu valor DKIM)
```
**Manter:** ✅ Essencial para autenticação de email e evitar spam

#### 3. Registros de Autodiscover/Autoconfig (Email)
```
A     autodiscover.zurbo.com.br.  →  108.167.132.238
A     autoconfig.zurbo.com.br.   →  108.167.132.238
SRV   _autodiscover._tcp.zurbo.com.br.  →  cpanelemaildiscovery.cpanel.net
SRV   _carddav._tcp.zurbo.com.br.  →  br884.hostgator.com.br
SRV   _carddavs._tcp.zurbo.com.br.  →  br884.hostgator.com.br
SRV   _caldav._tcp.zurbo.com.br.  →  br884.hostgator.com.br
SRV   _caldavs._tcp.zurbo.com.br.  →  br884.hostgator.com.br
```
**Manter:** ✅ Essencial para configuração automática de email em clientes

#### 4. Webmail e cPanel (se você usa)
```
A     webmail.zurbo.com.br.  →  108.167.132.238
A     cpanel.zurbo.com.br.   →  108.167.132.238
A     whm.zurbo.com.br.      →  108.167.132.238
```
**Manter:** ✅ Se você acessa webmail ou cPanel

#### 5. Outros Serviços (se você usa)
```
A     mail.zurbo.com.br.     →  108.167.132.238
A     webdisk.zurbo.com.br.  →  108.167.132.238
CNAME ftp.zurbo.com.br.       →  zurbo.com.br
```
**Manter:** ✅ Se você usa esses serviços

---

### ⚠️ REGISTROS QUE DEVEM SER ALTERADOS

#### 1. Registro A para domínio raiz (SUBSTITUIR)
```
❌ ATUAL:
A  zurbo.com.br.  →  185.158.133.1

✅ NOVO (para Vercel):
A  zurbo.com.br.  →  76.76.21.21
```

#### 2. Registro A para www (REMOVER e SUBSTITUIR)
```
❌ ATUAL:
A  www.zurbo.com.br.  →  185.158.133.1

✅ NOVO (para Vercel):
CNAME  www.zurbo.com.br.  →  cname.vercel-dns.com
```
**Nota:** Remova o registro A e adicione o CNAME

---

### 🗑️ REGISTROS QUE PODEM SER REMOVIDOS (Se não usar)

Estes são temporários ou de teste. Podem ser removidos:

```
TXT  _acme-challenge.zurbo.com.br.  →  (temporário para SSL)
TXT  _cpanel-dcv-test-record.zurbo.com.br.  →  (teste)
A    localhost.zurbo.com.br.  →  (geralmente não necessário)
A    cpcontacts.zurbo.com.br.  →  (se não usar)
A    cpcalendars.zurbo.com.br.  →  (se não usar)
```

---

## 📝 Configuração Final Recomendada

### Registros DNS que devem existir:

#### Para o Website (Vercel):
```
A     @ (ou zurbo.com.br)      →  76.76.21.21
CNAME www                      →  cname.vercel-dns.com
```

#### Para Email (Manter):
```
MX    @ (ou zurbo.com.br)      →  mx1.titan.email      (Prioridade: 10)
MX    @ (ou zurbo.com.br)      →  mx2.titan.email      (Prioridade: 20)
TXT   @ (ou zurbo.com.br)      →  "v=spf1 include:spf.titan.email ~all"
TXT   titan1._domainkey        →  (seu valor DKIM completo)
TXT   default._domainkey       →  (seu valor DKIM completo)
```

#### Para Email Automático (Manter):
```
A     autodiscover            →  108.167.132.238
A     autoconfig               →  108.167.132.238
SRV   _autodiscover._tcp       →  cpanelemaildiscovery.cpanel.net
```

#### Para Serviços (Manter se usar):
```
A     webmail                  →  108.167.132.238
A     mail                     →  108.167.132.238
A     cpanel                   →  108.167.132.238
CNAME ftp                      →  zurbo.com.br
```

---

## 🚀 Passos para Configurar

### Opção 1: Configuração Manual (Recomendada)

1. **Acesse o DNS Zone Editor da Hostgator**
2. **Edite o registro A do domínio raiz:**
   - Encontre: `A zurbo.com.br → 185.158.133.1`
   - Altere para: `A zurbo.com.br → 76.76.21.21`
   - Salve

3. **Remova o registro A de www e adicione CNAME:**
   - Remova: `A www.zurbo.com.br → 185.158.133.1`
   - Adicione: `CNAME www → cname.vercel-dns.com`
   - Salve

4. **Mantenha TODOS os outros registros intactos**

5. **Aguarde propagação (5 min a 2 horas)**

### Opção 2: Exportar, Limpar e Reconfigurar

⚠️ **CUIDADO:** Esta opção é mais arriscada. Faça backup primeiro!

1. **Exporte/Salve todos os registros atuais** (screenshot ou cópia)
2. **Adicione os novos registros necessários**
3. **Não apague os registros de email**

---

## ⚠️ IMPORTANTE

- **NÃO apague registros de email** (MX, TXT SPF/DKIM)
- **NÃO apague autodiscover/autoconfig**
- **Apenas altere os registros A de `zurbo.com.br` e `www`**
- **Faça backup antes de alterar qualquer coisa**

---

## ✅ Verificação

Após configurar, execute:

```bash
npx vercel domains inspect zurbo.com.br
```

Ou acesse: https://vercel.com/zurbo/zurbo/settings/domains

Quando o status mudar para "Valid Configuration", está pronto!

