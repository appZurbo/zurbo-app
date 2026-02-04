# Script para verificar URLs configuradas no Supabase

param(
    [Parameter(Mandatory=$true)]
    [string]$AccessToken
)

$PROJECT_REF = "mbzxifrkabfnufliawzo"
$API_URL = "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth"

Write-Host "=== CONFIGURACAO DE URLS ===" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $API_URL -Method GET `
        -Headers @{
            "Authorization" = "Bearer $AccessToken"
            "Content-Type" = "application/json"
        }
    
    Write-Host "Site URL:" -ForegroundColor Yellow
    Write-Host "  $($response.site_url)" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "URLs de Redirecionamento:" -ForegroundColor Yellow
    if ($response.uri_allow_list) {
        $response.uri_allow_list -split "," | ForEach-Object {
            $url = $_.Trim()
            if ($url -match "lovable") {
                Write-Host "  [X] $url" -ForegroundColor Red
            } else {
                Write-Host "  [OK] $url" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "  (nenhuma URL configurada)" -ForegroundColor Red
    }
    Write-Host ""
    
    # Verificar se há URLs da Lovable
    if ($response.uri_allow_list -match "lovable") {
        Write-Host "ATENCAO: Ainda existem URLs da Lovable configuradas!" -ForegroundColor Red
    } else {
        Write-Host "Todas as URLs estao corretas!" -ForegroundColor Green
    }
    
} catch {
    Write-Host "Erro ao verificar URLs:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

