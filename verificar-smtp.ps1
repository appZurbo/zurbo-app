# Script para verificar configuração SMTP no Supabase

param(
    [Parameter(Mandatory=$true)]
    [string]$AccessToken
)

$PROJECT_REF = "mbzxifrkabfnufliawzo"
$API_URL = "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth"

Write-Host "Verificando configuracao SMTP..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $API_URL -Method GET `
        -Headers @{
            "Authorization" = "Bearer $AccessToken"
            "Content-Type" = "application/json"
        }
    
    Write-Host "Configuracao SMTP atual:" -ForegroundColor Green
    Write-Host ""
    
    if ($response.external_email_enabled) {
        Write-Host "  [OK] SMTP Customizado: Habilitado" -ForegroundColor Green
    } else {
        Write-Host "  [X] SMTP Customizado: Desabilitado" -ForegroundColor Red
    }
    
    if ($response.smtp_admin_email) {
        Write-Host "  [OK] Email Remetente: $($response.smtp_admin_email)" -ForegroundColor Green
    }
    
    if ($response.smtp_host) {
        Write-Host "  [OK] SMTP Host: $($response.smtp_host)" -ForegroundColor Green
    }
    
    if ($response.smtp_port) {
        Write-Host "  [OK] SMTP Porta: $($response.smtp_port)" -ForegroundColor Green
    }
    
    if ($response.smtp_user) {
        Write-Host "  [OK] SMTP Usuario: $($response.smtp_user)" -ForegroundColor Green
    }
    
    if ($response.smtp_sender_name) {
        Write-Host "  [OK] Nome Remetente: $($response.smtp_sender_name)" -ForegroundColor Green
    }
    
    if ($response.smtp_pass) {
        Write-Host "  [OK] Senha SMTP: Configurada (oculta)" -ForegroundColor Green
    } else {
        Write-Host "  [X] Senha SMTP: Nao configurada" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Resumo completo:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5 | Write-Host
    
} catch {
    Write-Host "Erro ao verificar configuracao:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

