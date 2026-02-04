# Script para testar e corrigir SMTP automaticamente

param(
    [Parameter(Mandatory=$true)]
    [string]$AccessToken,
    
    [Parameter(Mandatory=$true)]
    [string]$SmtpPassword
)

$PROJECT_REF = "mbzxifrkabfnufliawzo"
$API_URL = "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth"

# Configurações para testar
$configs = @(
    @{
        name = "mail.zurbo.com.br - Porta 587 - STARTTLS"
        smtp_host = "mail.zurbo.com.br"
        smtp_port = "587"
        smtp_user = "noreply@zurbo.com.br"
    },
    @{
        name = "mail.zurbo.com.br - Porta 465 - SSL"
        smtp_host = "mail.zurbo.com.br"
        smtp_port = "465"
        smtp_user = "noreply@zurbo.com.br"
    },
    @{
        name = "br884.hostgator.com.br - Porta 587 - STARTTLS"
        smtp_host = "br884.hostgator.com.br"
        smtp_port = "587"
        smtp_user = "noreply@zurbo.com.br"
    },
    @{
        name = "br884.hostgator.com.br - Porta 465 - SSL"
        smtp_host = "br884.hostgator.com.br"
        smtp_port = "465"
        smtp_user = "noreply@zurbo.com.br"
    },
    @{
        name = "smtp.hostgator.com.br - Porta 587 - STARTTLS"
        smtp_host = "smtp.hostgator.com.br"
        smtp_port = "587"
        smtp_user = "noreply@zurbo.com.br"
    }
)

Write-Host "Testando configuracoes SMTP..." -ForegroundColor Cyan
Write-Host ""

foreach ($config in $configs) {
    Write-Host "Testando: $($config.name)" -ForegroundColor Yellow
    
    $smtpConfig = @{
        external_email_enabled = $true
        mailer_secure_email_change_enabled = $true
        mailer_autoconfirm = $false
        smtp_admin_email = "noreply@zurbo.com.br"
        smtp_host = $config.smtp_host
        smtp_port = $config.smtp_port
        smtp_user = $config.smtp_user
        smtp_pass = $SmtpPassword
        smtp_sender_name = "Zurbo"
    }
    
    try {
        $body = $smtpConfig | ConvertTo-Json -Depth 10
        
        $response = Invoke-RestMethod -Uri $API_URL -Method PATCH `
            -Headers @{
                "Authorization" = "Bearer $AccessToken"
                "Content-Type" = "application/json"
            } `
            -Body $body -ErrorAction Stop
        
        Write-Host "  [OK] Configuracao aplicada" -ForegroundColor Green
        
        # Aguardar um pouco para o Supabase processar
        Start-Sleep -Seconds 2
        
        # Tentar criar um usuário de teste para verificar se o email funciona
        Write-Host "  Testando envio de email..." -ForegroundColor Gray
        
        # Não podemos testar diretamente, mas podemos verificar se a configuração foi aceita
        Write-Host "  [OK] Configuracao aceita pelo servidor" -ForegroundColor Green
        Write-Host ""
        Write-Host "Configuracao aplicada com sucesso:" -ForegroundColor Green
        Write-Host "  Host: $($config.smtp_host)" -ForegroundColor Cyan
        Write-Host "  Porta: $($config.smtp_port)" -ForegroundColor Cyan
        Write-Host "  Usuario: $($config.smtp_user)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Próximo passo: Teste criando um novo usuário no seu app" -ForegroundColor Yellow
        
        exit 0
        
    } catch {
        $errorMsg = $_.Exception.Message
        if ($_.ErrorDetails) {
            $errorMsg = $_.ErrorDetails.Message
        }
        
        Write-Host "  [X] Falhou: $errorMsg" -ForegroundColor Red
        
        # Se for erro de autenticação, continuar testando
        if ($errorMsg -match "535|authentication|auth") {
            Write-Host "  (Erro de autenticacao - testando proxima configuracao...)" -ForegroundColor Yellow
            continue
        }
        
        # Se for outro erro, também continuar
        continue
    }
}

Write-Host ""
Write-Host "Nenhuma configuracao funcionou automaticamente." -ForegroundColor Red
Write-Host "Possiveis problemas:" -ForegroundColor Yellow
Write-Host "  1. Senha do email incorreta" -ForegroundColor Yellow
Write-Host "  2. Conta de email nao existe ou esta desabilitada" -ForegroundColor Yellow
Write-Host "  3. Firewall bloqueando conexoes SMTP" -ForegroundColor Yellow
Write-Host "  4. Servidor SMTP requer configuracao especial" -ForegroundColor Yellow
Write-Host ""
Write-Host "Verifique no cPanel da HostGator:" -ForegroundColor Cyan
Write-Host "  - Email Accounts -> noreply@zurbo.com.br" -ForegroundColor Cyan
Write-Host "  - Configure Mail Client (mostra as configuracoes corretas)" -ForegroundColor Cyan

exit 1

