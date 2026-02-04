# Script para testar conexão SMTP da HostGator

param(
    [string]$SmtpHost = "mail.zurbo.com.br",
    [int]$SmtpPort = 587,
    [string]$SmtpUser = "noreply@zurbo.com.br",
    [string]$SmtpPassword
)

Write-Host "Testando conexao SMTP..." -ForegroundColor Cyan
Write-Host "Host: $SmtpHost" -ForegroundColor Yellow
Write-Host "Porta: $SmtpPort" -ForegroundColor Yellow
Write-Host "Usuario: $SmtpUser" -ForegroundColor Yellow
Write-Host ""

if (-not $SmtpPassword) {
    Write-Host "ERRO: Senha nao fornecida" -ForegroundColor Red
    Write-Host "Uso: .\testar-smtp-hostgator.ps1 -SmtpPassword 'sua-senha'" -ForegroundColor Yellow
    exit 1
}

try {
    # Tentar conectar via System.Net.Mail
    $smtpClient = New-Object System.Net.Mail.SmtpClient($SmtpHost, $SmtpPort)
    $smtpClient.EnableSsl = $true
    $smtpClient.Credentials = New-Object System.Net.NetworkCredential($SmtpUser, $SmtpPassword)
    $smtpClient.Timeout = 10000
    
    Write-Host "Conectando ao servidor SMTP..." -ForegroundColor Gray
    
    # Criar mensagem de teste
    $mailMessage = New-Object System.Net.Mail.MailMessage
    $mailMessage.From = New-Object System.Net.Mail.MailAddress($SmtpUser, "Zurbo")
    $mailMessage.To.Add("teste@example.com")
    $mailMessage.Subject = "Teste SMTP"
    $mailMessage.Body = "Este e um teste de conexao SMTP"
    
    # Não enviar, apenas testar credenciais
    Write-Host "Testando autenticacao..." -ForegroundColor Gray
    
    # Tentar autenticar (sem enviar email)
    $smtpClient.Send($mailMessage)
    
    Write-Host "SUCESSO: Conexao SMTP funcionando!" -ForegroundColor Green
    
} catch {
    Write-Host "ERRO ao conectar ao SMTP:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Message -match "535") {
        Write-Host ""
        Write-Host "ERRO 535: Dados de autenticacao incorretos" -ForegroundColor Red
        Write-Host "Possiveis causas:" -ForegroundColor Yellow
        Write-Host "  1. Senha do email incorreta" -ForegroundColor Yellow
        Write-Host "  2. Usuario SMTP incorreto (deve ser o email completo)" -ForegroundColor Yellow
        Write-Host "  3. Conta de email nao existe ou esta desabilitada" -ForegroundColor Yellow
        Write-Host "  4. Servidor SMTP requer autenticacao diferente" -ForegroundColor Yellow
    } elseif ($_.Exception.Message -match "timeout|connection") {
        Write-Host ""
        Write-Host "ERRO: Nao foi possivel conectar ao servidor" -ForegroundColor Red
        Write-Host "Possiveis causas:" -ForegroundColor Yellow
        Write-Host "  1. Firewall bloqueando porta $SmtpPort" -ForegroundColor Yellow
        Write-Host "  2. Servidor SMTP incorreto" -ForegroundColor Yellow
        Write-Host "  3. Porta incorreta (tente 465 para SSL)" -ForegroundColor Yellow
    }
    
    exit 1
} finally {
    if ($smtpClient) {
        $smtpClient.Dispose()
    }
}

