const trustedDomains = ['lovableproject.com', 'lovable.dev', 'localhost'];

export const setupSecurityHeaders = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const connectSrc = supabaseUrl
    ? `'self' ${supabaseUrl} ${supabaseUrl.replace('https://', 'wss://')}`
    : "'self'";

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-ancestors 'self' https://*.lovableproject.com https://*.lovable.dev",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  }

  if (window.self !== window.top) {
    const parentOrigin = document.referrer;
    const isTrustedDomain = trustedDomains.some(domain => 
      parentOrigin.includes(domain)
    );

    if (!isTrustedDomain && import.meta.env.PROD) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Possible clickjacking attempt detected');
      }
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
          <h2>Restricted Access</h2>
          <p>This application cannot run in this context for security reasons.</p>
          <a href="${window.location.origin}" style="color: #f97316; text-decoration: none;">
            Open application directly
          </a>
        </div>
      `;
      return;
    }
  }

  if (import.meta.env.PROD) {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };
    
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    
    window.addEventListener('error', (e) => {
      originalConsole.error('Critical error:', e.error);
    });
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

export const validateCSRF = (): boolean => {
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
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Possible CSRF attempt detected');
      }
      return false;
    }
  }

  return true;
};
