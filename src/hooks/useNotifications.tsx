
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
  const { profile, isAuthenticated } = useAuth();
  const channelRef = useRef<any>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    
    // Cleanup any existing channel
    if (channelRef.current) {
      console.log('Cleaning up existing notifications channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (!isAuthenticated || !profile) {
      setNotifications([]);
      return;
    }

    console.log('Setting up notifications for user:', profile.id);
    loadNotifications();
    
    // Set up real-time subscription with unique channel name
    const channelName = `notifications-${profile.id}-${Date.now()}`;
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
          if (!mounted.current) return;
          console.log('New notification received:', payload);
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
        }
      )
      .subscribe((status) => {
        console.log('Notifications channel status:', status);
      });

    return () => {
      mounted.current = false;
      if (channelRef.current) {
        console.log('Cleaning up notifications channel on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [profile?.id, isAuthenticated]);

  const loadNotifications = async () => {
    if (!profile || !isAuthenticated || !mounted.current) return;
    
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
      
      if (mounted.current) {
        const typedNotifications: Notification[] = (data || []).map(item => ({
          ...item,
          type: item.type as Notification['type']
        }));
        
        setNotifications(typedNotifications);
        console.log('Loaded notifications:', typedNotifications.length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!isAuthenticated || !mounted.current) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      if (mounted.current) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!profile || !isAuthenticated || !mounted.current) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', profile.id)
        .eq('is_read', false);

      if (error) throw error;

      if (mounted.current) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, is_read: true }))
        );
      }
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
