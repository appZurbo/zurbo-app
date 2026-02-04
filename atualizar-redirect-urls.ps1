# Script para atualizar URLs de redirecionamento no Supabase

param(
    [Parameter(Mandatory=$true)]
    [string]$AccessToken
)

$PROJECT_REF = "mbzxifrkabfnufliawzo"
$API_URL = "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth"

# URLs corretas para o domínio zurbo.com.br
$CORRECT_URLS = @(
    "https://zurbo.com.br/**",
    "https://www.zurbo.com.br/**",
    "http://localhost:3000/**",
    "http://localhost:5173/**"
)

Write-Host "Atualizando URLs de redirecionamento..." -ForegroundColor Cyan
Write-Host ""

# Primeiro, obter configuração atual
try {
    Write-Host "Obtendo configuracao atual..." -ForegroundColor Gray
    $currentConfig = Invoke-RestMethod -Uri $API_URL -Method GET `
        -Headers @{
            "Authorization" = "Bearer $AccessToken"
            "Content-Type" = "application/json"
        }
    
    Write-Host "URLs atuais:" -ForegroundColor Yellow
    if ($currentConfig.uri_allow_list) {
        $currentConfig.uri_allow_list -split "," | ForEach-Object {
            Write-Host "  - $_" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  (nenhuma URL configurada)" -ForegroundColor Yellow
    }
    Write-Host ""
    
    # Criar objeto de atualização
    $updateConfig = @{
        uri_allow_list = ($CORRECT_URLS -join ",")
        site_url = "https://zurbo.com.br"
    }
    
    Write-Host "Atualizando para:" -ForegroundColor Green
    $CORRECT_URLS | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Green
    }
    Write-Host ""
    
    # Atualizar configuração
    $body = $updateConfig | ConvertTo-Json
    Write-Host "Enviando atualizacao..." -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri $API_URL -Method PATCH `
        -Headers @{
            "Authorization" = "Bearer $AccessToken"
            "Content-Type" = "application/json"
        } `
        -Body $body
    
    Write-Host "URLs de redirecionamento atualizadas com sucesso!" -ForegroundColor Green
    Write-Host ""
    
    # Verificar configuração atualizada
    Write-Host "Verificando configuracao atualizada..." -ForegroundColor Cyan
    $updatedConfig = Invoke-RestMethod -Uri $API_URL -Method GET `
        -Headers @{
            "Authorization" = "Bearer $AccessToken"
            "Content-Type" = "application/json"
        }
    
    Write-Host "URLs configuradas:" -ForegroundColor Green
    if ($updatedConfig.uri_allow_list) {
        $updatedConfig.uri_allow_list -split "," | ForEach-Object {
            Write-Host "  [OK] $_" -ForegroundColor Green
        }
    }
    Write-Host ""
    Write-Host "Configuracao concluida!" -ForegroundColor Green
    
} catch {
    Write-Host "Erro ao atualizar URLs:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        Write-Host "Detalhes do erro:" -ForegroundColor Red
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
    
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $responseBody = $reader.ReadToEnd()
            Write-Host "Resposta do servidor:" -ForegroundColor Red
            Write-Host $responseBody -ForegroundColor Red
        } catch {
            Write-Host "Nao foi possivel ler a resposta do servidor" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "Dicas:" -ForegroundColor Yellow
    Write-Host "   1. Verifique se o Access Token esta correto"
    Write-Host "   2. Verifique se voce tem permissoes para modificar o projeto"
    exit 1
}

