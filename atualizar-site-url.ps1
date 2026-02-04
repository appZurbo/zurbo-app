# Script para atualizar site_url no Supabase

param(
    [Parameter(Mandatory=$true)]
    [string]$AccessToken
)

$PROJECT_REF = "mbzxifrkabfnufliawzo"
$API_URL = "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth"

Write-Host "Atualizando site_url..." -ForegroundColor Cyan
Write-Host ""

try {
    # Obter configuração atual
    $currentConfig = Invoke-RestMethod -Uri $API_URL -Method GET `
        -Headers @{
            "Authorization" = "Bearer $AccessToken"
            "Content-Type" = "application/json"
        }
    
    Write-Host "Site URL atual: $($currentConfig.site_url)" -ForegroundColor Yellow
    Write-Host ""
    
    # Atualizar para HTTPS
    $updateConfig = @{
        site_url = "https://zurbo.com.br"
    }
    
    $body = $updateConfig | ConvertTo-Json
    Write-Host "Atualizando para: https://zurbo.com.br" -ForegroundColor Green
    Write-Host ""
    
    $response = Invoke-RestMethod -Uri $API_URL -Method PATCH `
        -Headers @{
            "Authorization" = "Bearer $AccessToken"
            "Content-Type" = "application/json"
        } `
        -Body $body
    
    # Verificar atualização
    $updatedConfig = Invoke-RestMethod -Uri $API_URL -Method GET `
        -Headers @{
            "Authorization" = "Bearer $AccessToken"
            "Content-Type" = "application/json"
        }
    
    Write-Host "Site URL atualizado: $($updatedConfig.site_url)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configuracao concluida!" -ForegroundColor Green
    
} catch {
    Write-Host "Erro ao atualizar site_url:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

