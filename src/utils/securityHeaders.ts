
export const setupSecurityHeaders = () => {
  // Lista de domínios confiáveis onde o app pode ser embedado
  const trustedDomains = [
    'lovableproject.com',
    'lovable.dev',
    'localhost'
  ];

  // Content Security Policy mais flexível para desenvolvimento
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://mbzxifrkabfnufliawzo.supabase.co wss://mbzxifrkabfnufliawzo.supabase.co",
    "frame-ancestors 'self' https://*.lovableproject.com https://*.lovable.dev",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  // Criar meta tag para CSP se não existir
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  }

  // Verificação de clickjacking mais inteligente
  if (window.self !== window.top) {
    const parentOrigin = document.referrer;
    const isTrustedDomain = trustedDomains.some(domain => 
      parentOrigin.includes(domain)
    );

    if (!isTrustedDomain && import.meta.env.PROD) {
      // Apenas em produção e domínios não confiáveis
      console.warn('Possível tentativa de clickjacking detectada');
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
          <h2>Acesso Restrito</h2>
          <p>Este aplicativo não pode ser executado neste contexto por motivos de segurança.</p>
          <a href="${window.location.origin}" style="color: #f97316; text-decoration: none;">
            Acessar aplicativo diretamente
          </a>
        </div>
      `;
      return;
    }
  }

  // Manter console apenas em desenvolvimento
  if (import.meta.env.PROD) {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };
    
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    
    // Manter apenas erros críticos
    window.addEventListener('error', (e) => {
      originalConsole.error('Critical error:', e.error);
    });
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

export const validateCSRF = () => {
  // Verificar se a requisição veio do mesmo origin
  const referrer = document.referrer;
  const origin = window.location.origin;
  
  if (referrer && !referrer.startsWith(origin)) {
    const trustedDomains = [
      'lovableproject.com',
      'lovable.dev',
      'localhost'
    ];
    
    const isTrusted = trustedDomains.some(domain => 
      referrer.includes(domain)
    );
    
    if (!isTrusted) {
      console.warn('Possível ataque CSRF detectado');
      return false;
    }
  }
  
  return true;
};
