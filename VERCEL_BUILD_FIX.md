# Fix para Build Vercel - Conflito de Dependências

## Problema
O build na Vercel falhava com erro de conflito de dependências entre `react-day-picker@8.10.1` e `date-fns@4.1.0`.

## Soluções Implementadas

### 1. Arquivo `.npmrc`
Já existe e contém:
```
legacy-peer-deps=true
```

### 2. Arquivo `vercel.json`
Configurado com:
```json
{
  "installCommand": "npm ci --legacy-peer-deps || npm install --legacy-peer-deps"
}
```

### 3. Configuração na Vercel (MANUAL)
Se o problema persistir, configure manualmente na Vercel:

1. Acesse: https://vercel.com/zurbo/settings/general
2. Em "Build & Development Settings":
   - **Install Command**: `npm ci --legacy-peer-deps || npm install --legacy-peer-deps`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Development Command**: `npm run dev`

## Verificação
Após estas configurações, o build deve funcionar corretamente.

