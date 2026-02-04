# Script PowerShell para Configurar SMTP no Supabase via Management API
# Requer: Access Token do Supabase (obtenha em https://supabase.com/dashboard/account/tokens)

param(
    [Parameter(Mandatory=$true)]
    [string]$AccessToken,
    
    [Parameter(Mandatory=$false)]
    [string]$SmtpPassword
)

$PROJECT_REF = "mbzxifrkabfnufliawzo"
$API_URL = "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth"

# Configurações SMTP HostGator
$smtpConfig = @{
    external_email_enabled = $true
    mailer_secure_email_change_enabled = $true
    mailer_autoconfirm = $false
    smtp_admin_email = "noreply@zurbo.com.br"
    smtp_host = "mail.zurbo.com.br"
    smtp_port = "587"
    smtp_user = "noreply@zurbo.com.br"
    smtp_sender_name = "Zurbo"
}

# Se a senha foi fornecida, adiciona ao config
if ($SmtpPassword) {
    $smtpConfig.smtp_pass = $SmtpPassword
}

Write-Host "Configurando SMTP no Supabase..." -ForegroundColor Cyan
Write-Host "Email: noreply@zurbo.com.br" -ForegroundColor Yellow
Write-Host "Host: mail.zurbo.com.br" -ForegroundColor Yellow
Write-Host "Porta: 587 (STARTTLS)" -ForegroundColor Yellow
Write-Host ""

try {
    $body = $smtpConfig | ConvertTo-Json -Depth 10
    Write-Host "Enviando configuracao..." -ForegroundColor Gray
    Write-Host "Body: $body" -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri $API_URL -Method PATCH `
        -Headers @{
            "Authorization" = "Bearer $AccessToken"
            "Content-Type" = "application/json"
        } `
        -Body $body
    
    Write-Host "SMTP configurado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configuracoes aplicadas:" -ForegroundColor Cyan
    Write-Host "   - Sender: Zurbo (noreply@zurbo.com.br)"
    Write-Host "   - Host: mail.zurbo.com.br"
    Write-Host "   - Porta: 587"
    Write-Host "   - Security: STARTTLS"
    Write-Host ""
    Write-Host "Proximo passo: Teste criando um novo usuario no seu app" -ForegroundColor Yellow
    
} catch {
    Write-Host "Erro ao configurar SMTP:" -ForegroundColor Red
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
    Write-Host "   3. A senha do SMTP pode ser obrigatoria - configure manualmente no Dashboard"
    Write-Host "   4. Tente obter um novo token em: https://supabase.com/dashboard/account/tokens"
    exit 1
}
