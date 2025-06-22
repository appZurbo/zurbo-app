
import { useEffect } from 'react';
import { setupSecurityHeaders, validateCSRF } from '@/utils/securityHeaders';
import { securityLogger } from '@/utils/securityLogger';

export const useSecurity = () => {
  useEffect(() => {
    // Configurar headers de segurança
    setupSecurityHeaders();

    // Validar CSRF em navegação
    const handleBeforeUnload = () => {
      if (!validateCSRF()) {
        securityLogger.logSuspiciousActivity('Possible CSRF attack detected');
      }
    };

    // Detectar tentativas de acesso via DevTools (método simples)
    let devtools = {open: false};
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        if (!devtools.open) {
          devtools.open = true;
          if (import.meta.env.PROD) {
            securityLogger.logSuspiciousActivity('Developer tools opened in production');
          }
        }
      } else {
        devtools.open = false;
      }
    }, 1000);

    // Detectar tentativas de copy/paste de código suspeito
    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text') || '';
      if (pastedText.includes('<script') || pastedText.includes('javascript:')) {
        securityLogger.logSuspiciousActivity('Suspicious code pasted into application');
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  return {
    logSecurityEvent: securityLogger.logEvent.bind(securityLogger)
  };
};
