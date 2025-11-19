import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';

export interface NotificationData {
  [key: string]: any;
}

export class NotificationService {
  /**
   * Solicita permissões para notificações push
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        Alert.alert(
          'Aviso',
          'Notificações push só funcionam em dispositivos físicos, não em emuladores.'
        );
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'A permissão de notificações é necessária para receber atualizações sobre seus serviços.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Para Android, configurar canal de notificação
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Notificações Zurbo',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificações:', error);
      return false;
    }
  }

  /**
   * Obtém o token de push notification
   */
  static async getPushToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id-here', // Substitua pelo seu project ID do EAS
      });

      return tokenData.data;
    } catch (error) {
      console.error('Erro ao obter token de push:', error);
      return null;
    }
  }

  /**
   * Agenda uma notificação local
   */
  static async scheduleNotification(
    title: string,
    body: string,
    data?: NotificationData,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: trigger || null, // null = notificação imediata
      });

      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return null;
    }
  }

  /**
   * Cancela uma notificação agendada
   */
  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }

  /**
   * Cancela todas as notificações agendadas
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  }

  /**
   * Configura listeners para notificações
   */
  static setupListeners() {
    // Listener para quando uma notificação é recebida enquanto o app está em foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notificação recebida:', notification);
      // Você pode adicionar lógica aqui para mostrar um alerta customizado
    });

    // Listener para quando o usuário toca em uma notificação
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Usuário tocou na notificação:', response);
      const data = response.notification.request.content.data;
      // Você pode navegar para uma tela específica baseada nos dados
    });
  }

  /**
   * Obtém todas as notificações agendadas
   */
  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao obter notificações agendadas:', error);
      return [];
    }
  }
}

