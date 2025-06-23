
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'new_client' | 'new_review' | 'new_message' | 'system_update' | 'payment' | 'schedule_change';
  read: boolean;
  created_at: string;
  metadata?: {
    pedido_id?: string;
    chat_id?: string;
    user_name?: string;
    service_name?: string;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      loadNotifications();
      // Set up real-time subscription for new notifications
      const channel = supabase
        .channel('notifications-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${profile.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const loadNotifications = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      const typedNotifications: Notification[] = (data || []).map(item => ({
        ...item,
        type: item.type as Notification['type'],
        metadata: item.metadata ? JSON.parse(item.metadata) : undefined
      }));
      
      setNotifications(typedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', profile.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          ...notification,
          metadata: notification.metadata ? JSON.stringify(notification.metadata) : null
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications.slice(0, 5);

  return {
    notifications,
    recentNotifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loadNotifications,
    createNotification,
  };
};
