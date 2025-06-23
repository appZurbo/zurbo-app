
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bell, Filter, CheckCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NotificacoesPage = () => {
  const navigate = useNavigate();
  const { notifications, loading, unreadCount, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<string>('all');

  const filterOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'unread', label: 'Não lidas' },
    { value: 'new_message', label: 'Mensagens' },
    { value: 'new_client', label: 'Novos Clientes' },
    { value: 'payment', label: 'Pagamentos' },
    { value: 'schedule_change', label: 'Agenda' },
    { value: 'system_update', label: 'Sistema' },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const getFilterCount = (filterType: string) => {
    if (filterType === 'all') return notifications.length;
    if (filterType === 'unread') return unreadCount;
    return notifications.filter(n => n.type === filterType).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <Bell className="h-8 w-8 text-white" />
          </div>
          <p>Carregando notificações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notificações
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} não lidas
                </Badge>
              )}
            </h1>
            <p className="text-gray-600">
              Histórico completo de todas as suas notificações
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} size="sm">
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Filtrar por:</span>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        <Badge variant="secondary" className="ml-2">
                          {getFilterCount(option.value)}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Notificações */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                {filter === 'all' 
                  ? 'Nenhuma notificação ainda' 
                  : `Nenhuma notificação do tipo "${filterOptions.find(f => f.value === filter)?.label}"`
                }
              </h3>
              <p className="text-gray-600">
                {filter === 'all'
                  ? 'Suas notificações aparecerão aqui quando houver atividade em sua conta.'
                  : 'Tente selecionar outro filtro para ver mais notificações.'
                }
              </p>
              {filter !== 'all' && (
                <Button 
                  variant="outline" 
                  onClick={() => setFilter('all')}
                  className="mt-4"
                >
                  Ver todas as notificações
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {filteredNotifications.length} notificação{filteredNotifications.length !== 1 ? 'ões' : ''}
                {filter !== 'all' && ` - ${filterOptions.find(f => f.value === filter)?.label}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informação sobre histórico */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  Sobre o histórico de notificações
                </h4>
                <p className="text-sm text-blue-700">
                  Todas as suas notificações ficam salvas permanentemente para futuras consultas. 
                  Isso inclui mensagens, pedidos, pagamentos, alterações na agenda e atualizações do sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificacoesPage;
