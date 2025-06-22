
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'new_client' | 'new_review' | 'new_message' | 'system_update';
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      loadNotifications();
    }
  }, [profile]);

  const loadNotifications = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      // For now, we'll use mock data
      // When the notifications table is created, we can load from there
      console.log('Loading notifications for user:', profile.id);
      setNotifications([]);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // For now, we'll just update local state
      // When the notifications table is created, we can update there
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
    try {
      // For now, we'll just update local state
      // When the notifications table is created, we can update there
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loadNotifications,
  };
};
