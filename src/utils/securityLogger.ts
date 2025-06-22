
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  event_type: 'login_attempt' | 'login_success' | 'login_failed' | 'profile_update' | 'password_change' | 'suspicious_activity' | 'file_upload' | 'account_creation';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityLogger {
  private getClientInfo() {
    return {
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
  }

  async logEvent(event: SecurityEvent) {
    try {
      const clientInfo = this.getClientInfo();
      
      // Log no console para desenvolvimento
      console.log(`[SECURITY] ${event.event_type}:`, {
        ...event,
        ...clientInfo
      });

      // Em produção, você pode enviar para um serviço de logging
      // Por enquanto, vamos armazenar localmente e no Supabase se possível
      const logEntry = {
        ...event,
        ...clientInfo,
        id: crypto.randomUUID()
      };

      // Armazenar no localStorage para auditoria local
      const existingLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      existingLogs.push(logEntry);
      
      // Manter apenas os últimos 1000 logs
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000);
      }
      
      localStorage.setItem('security_logs', JSON.stringify(existingLogs));

    } catch (error) {
      console.error('Erro ao registrar evento de segurança:', error);
    }
  }

  async logLoginAttempt(email: string, success: boolean, userId?: string) {
    await this.logEvent({
      event_type: success ? 'login_success' : 'login_failed',
      user_id: userId,
      details: { email },
      severity: success ? 'low' : 'medium'
    });
  }

  async logSuspiciousActivity(description: string, userId?: string) {
    await this.logEvent({
      event_type: 'suspicious_activity',
      user_id: userId,
      details: { description },
      severity: 'high'
    });
  }

  async logProfileUpdate(userId: string, changes: string[]) {
    await this.logEvent({
      event_type: 'profile_update',
      user_id: userId,
      details: { changes },
      severity: 'low'
    });
  }

  async logFileUpload(userId: string, fileName: string, fileSize: number, fileType: string) {
    await this.logEvent({
      event_type: 'file_upload',
      user_id: userId,
      details: { fileName, fileSize, fileType },
      severity: 'low'
    });
  }

  getSecurityLogs() {
    try {
      return JSON.parse(localStorage.getItem('security_logs') || '[]');
    } catch {
      return [];
    }
  }
}

export const securityLogger = new SecurityLogger();
