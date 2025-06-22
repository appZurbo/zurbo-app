
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Eye, Download, Trash2, AlertCircle } from 'lucide-react';
import { securityLogger } from '@/utils/securityLogger';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30); // minutos
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadSecuritySettings();
    loadRecentActivity();
  }, []);

  const loadSecuritySettings = () => {
    // Carregar configurações do localStorage ou API
    const settings = JSON.parse(localStorage.getItem('security_settings') || '{}');
    setTwoFactorEnabled(settings.twoFactorEnabled || false);
    setLoginNotifications(settings.loginNotifications !== false);
    setSecurityAlerts(settings.securityAlerts !== false);
    setSessionTimeout(settings.sessionTimeout || 30);
  };

  const saveSecuritySettings = (newSettings: any) => {
    const currentSettings = JSON.parse(localStorage.getItem('security_settings') || '{}');
    const updatedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem('security_settings', JSON.stringify(updatedSettings));
    
    if (profile?.id) {
      securityLogger.logEvent({
        event_type: 'profile_update',
        user_id: profile.id,
        details: { securitySettingsChanged: Object.keys(newSettings) },
        severity: 'low'
      });
    }
  };

  const loadRecentActivity = () => {
    const logs = securityLogger.getSecurityLogs();
    const userLogs = logs
      .filter((log: any) => log.user_id === profile?.id)
      .slice(-10)
      .reverse();
    setRecentActivity(userLogs);
  };

  const enableTwoFactor = async () => {
    // Implementar 2FA aqui (QR code, backup codes, etc.)
    toast({
      title: "2FA será implementado em breve",
      description: "Esta funcionalidade estará disponível na próxima atualização",
    });
  };

  const downloadSecurityReport = () => {
    const logs = securityLogger.getSecurityLogs();
    const userLogs = logs.filter((log: any) => log.user_id === profile?.id);
    
    const report = {
      user_id: profile?.id,
      generated_at: new Date().toISOString(),
      total_events: userLogs.length,
      events: userLogs,
      security_settings: {
        twoFactorEnabled,
        loginNotifications,
        securityAlerts,
        sessionTimeout
      }
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `security_report_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearSecurityLogs = () => {
    localStorage.removeItem('security_logs');
    setRecentActivity([]);
    toast({
      title: "Logs limpos",
      description: "Histórico de segurança foi removido",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-500" />
            Configurações de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Autenticação em Duas Etapas */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-gray-500" />
              <div>
                <Label>Autenticação em Duas Etapas (2FA)</Label>
                <p className="text-sm text-gray-600">
                  Adicione uma camada extra de segurança à sua conta
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {twoFactorEnabled && <Badge variant="secondary">Ativado</Badge>}
              <Button
                variant={twoFactorEnabled ? "destructive" : "default"}
                size="sm"
                onClick={enableTwoFactor}
              >
                {twoFactorEnabled ? 'Desativar' : 'Ativar'}
              </Button>
            </div>
          </div>

          {/* Notificações de Login */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="login-notifications">Notificações de Login</Label>
                <p className="text-sm text-gray-600">
                  Receber alerta quando alguém fizer login na sua conta
                </p>
              </div>
            </div>
            <Switch
              id="login-notifications"
              checked={loginNotifications}
              onCheckedChange={(checked) => {
                setLoginNotifications(checked);
                saveSecuritySettings({ loginNotifications: checked });
              }}
            />
          </div>

          {/* Alertas de Segurança */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="security-alerts">Alertas de Segurança</Label>
                <p className="text-sm text-gray-600">
                  Receber notificações sobre atividades suspeitas
                </p>
              </div>
            </div>
            <Switch
              id="security-alerts"
              checked={securityAlerts}
              onCheckedChange={(checked) => {
                setSecurityAlerts(checked);
                saveSecuritySettings({ securityAlerts: checked });
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Atividade Recente */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSecurityReport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar Relatório
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSecurityLogs}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Limpar Histórico
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade registrada</p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {activity.event_type.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(activity.timestamp).toLocaleString('pt-BR')}
                    </p>
                    {activity.details && (
                      <p className="text-xs text-gray-500">
                        {activity.user_agent ? `${activity.user_agent.split(' ')[0]}...` : 'Detalhes disponíveis'}
                      </p>
                    )}
                  </div>
                  <Badge variant={activity.severity === 'high' ? 'destructive' : 'secondary'}>
                    {activity.severity}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
