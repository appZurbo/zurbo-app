
export const setupSecurityHeaders = () => {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://mbzxifrkabfnufliawzo.supabase.co wss://mbzxifrkabfnufliawzo.supabase.co",
    "frame-ancestors 'none'",
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

  // Prevenir clickjacking
  if (window.self !== window.top) {
    document.body.style.display = 'none';
    console.warn('Possível tentativa de clickjacking detectada');
  }

  // Desabilitar console em produção
  if (import.meta.env.PROD) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
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
    console.warn('Possível ataque CSRF detectado');
    return false;
  }
  
  return true;
};
