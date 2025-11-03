# Como Configurar o Domínio zurbo.com.br na Vercel

## ✅ Status Atual
- Domínio `zurbo.com.br` já foi adicionado ao projeto Vercel
- Registrador: Hostgator
- Nameservers atuais: `ns884.hostgator.com.br` e `ns885.hostgator.com.br`

## ⚠️ O que precisa ser feito

Você tem **DUAS opções**. Recomendo a **Opção A** (mais simples):

---

## 🔧 OPÇÃO A: Adicionar Registro DNS (Recomendada)

Esta opção mantém seus nameservers atuais da Hostgator e apenas adiciona um registro DNS.

### Passos:

1. **Acesse o painel da Hostgator**:
   - Faça login no painel de controle da Hostgator
   - Vá em "DNS Zone Editor" ou "Gerenciador de DNS"

2. **Adicione o registro A para o domínio raiz**:
   - **Tipo**: `A`
   - **Nome/Host**: `@` (ou `zurbo.com.br` ou deixe em branco)
   - **TTL**: `3600` (ou padrão)
   - **Valor/IP**: `76.76.21.21`
   - Salve

3. **Adicione o registro CNAME para www**:
   - **Tipo**: `CNAME`
   - **Nome/Host**: `www`
   - **TTL**: `3600` (ou padrão)
   - **Valor**: `cname.vercel-dns.com`
   - Salve

4. **Aguarde a propagação**:
   - Pode levar de 5 minutos a 48 horas
   - Normalmente leva 1-2 horas

---

## 🔧 OPÇÃO B: Mudar Nameservers (Alternativa)

Esta opção transfere o gerenciamento DNS completo para a Vercel.

### Passos:

1. **Acesse o painel da Hostgator**:
   - Vá em "Nameservers" ou "Servidores de Nomes"

2. **Altere os nameservers para**:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
   - Salve as alterações

3. **Aguarde a propagação**:
   - Pode levar até 48 horas

---

## ✅ Verificação

Após configurar, verifique o status:

```bash
# Via CLI (eu posso rodar isso)
npx vercel domains inspect zurbo.com.br
```

Ou acesse: https://vercel.com/zurbo/zurbo/settings/domains

Quando estiver configurado corretamente, o status mudará de "Invalid Configuration" para "Valid Configuration" ✅

---

## 📝 Notas Importantes

- ⏱️ A propagação DNS pode levar tempo (até 48h, geralmente 1-2h)
- 🔄 A Vercel verificará automaticamente e enviará um email quando estiver pronto
- 🌐 Você pode usar `zurbo.com.br` e `www.zurbo.com.br` simultaneamente
- 🚨 Não apague outros registros DNS existentes (se houver emails, etc)

---

## 🆘 Precisa de Ajuda?

Se tiver dificuldades:
1. Tire screenshot do painel DNS da Hostgator
2. Me mostre e eu ajudo a configurar

