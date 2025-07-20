
import { useState, useEffect, useRef } from 'react';
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
  const { profile } = useAuth();
  
  // Use ref to track subscription and prevent duplicates
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!profile || isSubscribedRef.current) return;
    
    loadNotifications();
    
    // Clean up existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    
    // Set up real-time subscription for new notifications with unique channel name
    const channelName = `notifications-changes-${profile.id}-${Date.now()}`;
    channelRef.current = supabase
      .channel(channelName)
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
          
          // Play notification sound if available
          if ((window as any).playNotificationSound) {
            (window as any).playNotificationSound();
          }
        }
      );

    channelRef.current.subscribe((status: string) => {
      console.log('Notifications channel status:', status);
      isSubscribedRef.current = status === 'SUBSCRIBED';
    });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isSubscribedRef.current = false;
    };
  }, [profile?.id]); // Only depend on profile.id

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
      
      // Cast the data to properly typed notifications
      const typedNotifications: Notification[] = (data || []).map(item => ({
        ...item,
        type: item.type as Notification['type']
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
    if (!profile) return;

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
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: notification.user_id,
          title: notification.title,
          content: notification.content,
          type: notification.type,
          is_read: notification.is_read
        }]);

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
