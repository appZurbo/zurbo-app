
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'new_client' | 'new_review' | 'new_message' | 'system_update' | 'payment' | 'schedule_change';
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { profile, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      setNotifications([]);
      return;
    }

    console.log('Setting up notifications for user:', profile.id);
    loadNotifications();
    
    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel(`notifications-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up notifications channel');
      supabase.removeChannel(channel);
    };
  }, [profile?.id, isAuthenticated]);

  const loadNotifications = async () => {
    if (!profile || !isAuthenticated) return;
    
    setLoading(true);
    try {
      console.log('Loading notifications for user:', profile.id);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading notifications:', error);
        throw error;
      }
      
      const typedNotifications: Notification[] = (data || []).map(item => ({
        ...item,
        type: item.type as Notification['type']
      }));
      
      setNotifications(typedNotifications);
      console.log('Loaded notifications:', typedNotifications.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!isAuthenticated) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!profile || !isAuthenticated) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', profile.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    if (!isAuthenticated) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert([notification]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const recentNotifications = notifications.slice(0, 5);
  const hasNewMessages = unreadCount > 0;

  return {
    notifications,
    recentNotifications,
    loading,
    unreadCount,
    hasNewMessages,
    markAsRead,
    markAllAsRead,
    loadNotifications,
    createNotification,
  };
};
