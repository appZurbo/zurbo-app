
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Activity, Eye, Download } from 'lucide-react';
import { securityLogger } from '@/utils/securityLogger';
import { useAuth } from '@/hooks/useAuth';

const SecurityDashboard = () => {
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    suspiciousActivity: 0,
    failedLogins: 0,
    recentUploads: 0
  });
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      loadSecurityData();
    }
  }, [isAdmin]);

  const loadSecurityData = () => {
    const logs = securityLogger.getSecurityLogs();
    setSecurityLogs(logs.slice(-100)); // Últimos 100 eventos

    // Calcular estatísticas
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const recentLogs = logs.filter((log: any) => new Date(log.timestamp).getTime() > last24h);

    setStats({
      totalEvents: logs.length,
      suspiciousActivity: logs.filter((log: any) => log.event_type === 'suspicious_activity').length,
      failedLogins: logs.filter((log: any) => log.event_type === 'login_failed').length,
      recentUploads: recentLogs.filter((log: any) => log.event_type === 'file_upload').length
    });
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(securityLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `security_logs_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4" />;
      case 'login_failed': return <Shield className="h-4 w-4" />;
      case 'file_upload': return <Upload className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center p-8">
        <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
        <p className="text-gray-600">Apenas administr​adores podem acessar o painel de segurança.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-orange-500" />
          Painel de Segurança
        </h2>
        <Button onClick={exportLogs} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Logs
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Eventos</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atividade Suspeita</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspiciousActivity}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Logins Falhados</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.failedLogins}</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Uploads (24h)</p>
                <p className="text-2xl font-bold text-green-600">{stats.recentUploads}</p>
              </div>
              <Upload className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Eventos de Segurança Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {securityLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum evento registrado</p>
            ) : (
              securityLogs.reverse().map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getEventIcon(log.event_type)}
                    <div>
                      <p className="font-medium">{log.event_type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                      </p>
                      {log.details && (
                        <p className="text-xs text-gray-500">
                          {JSON.stringify(log.details)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={getSeverityColor(log.severity) as any}>
                    {log.severity}
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

export default SecurityDashboard;
