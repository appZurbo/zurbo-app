
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface RealtimeMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  message_type: string;
  image_url?: string;
}

export interface RealtimeConversation {
  id: string;
  cliente_id: string;
  prestador_id: string;
  servico_solicitado: string;
  status: string;
  updated_at: string;
}

export const useRealtimeChat = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [conversations, setConversations] = useState<RealtimeConversation[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessageNotification, setNewMessageNotification] = useState<RealtimeMessage | null>(null);
  
  // Use refs to track channels and prevent duplicate subscriptions
  const messagesChannelRef = useRef<any>(null);
  const conversationsChannelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!profile || isSubscribedRef.current) return;

    console.log('Setting up realtime chat for user:', profile.id);

    // Clean up any existing channels first
    if (messagesChannelRef.current) {
      supabase.removeChannel(messagesChannelRef.current);
      messagesChannelRef.current = null;
    }
    if (conversationsChannelRef.current) {
      supabase.removeChannel(conversationsChannelRef.current);
      conversationsChannelRef.current = null;
    }

    // Create unique channel names to avoid conflicts
    const messagesChannelName = `chat-messages-${profile.id}-${Date.now()}`;
    const conversationsChannelName = `chat-conversations-${profile.id}-${Date.now()}`;

    // Setup realtime subscription for messages with improved configuration
    messagesChannelRef.current = supabase
      .channel(messagesChannelName, {
        config: {
          broadcast: { ack: true },
          presence: { key: profile.id }
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          const newMessage = payload.new as RealtimeMessage;
          
          // Add message to state with optimistic updates
          setMessages(prev => {
            const exists = prev.find(m => m.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage].sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          });
          
          // Show notification if message is from another user
          if (newMessage.sender_id !== profile.id) {
            setUnreadCount(prev => prev + 1);
            setNewMessageNotification(newMessage);
            
            // Play notification sound
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Nova mensagem no Zurbo', {
                body: newMessage.content?.substring(0, 100) || 'Você recebeu uma nova mensagem',
                icon: '/favicon.ico',
                tag: 'chat-message'
              });
            }
            
            // Show toast notification
            toast({
              title: "💬 Nova mensagem",
              description: newMessage.content?.substring(0, 50) + (newMessage.content?.length > 50 ? '...' : ''),
              duration: 4000,
            });
            
            // Clear notification after 5 seconds
            setTimeout(() => {
              setNewMessageNotification(null);
            }, 5000);
          }
        }
      );

    // Setup realtime subscription for conversations
    conversationsChannelRef.current = supabase
      .channel(conversationsChannelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations'
        },
        (payload) => {
          console.log('Conversation updated:', payload);
          const updatedConversation = payload.new as RealtimeConversation;
          setConversations(prev => {
            const index = prev.findIndex(c => c.id === updatedConversation.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = updatedConversation;
              return updated;
            } else {
              return [...prev, updatedConversation];
            }
          });
        }
      );

    // Subscribe to both channels
    Promise.all([
      messagesChannelRef.current.subscribe(),
      conversationsChannelRef.current.subscribe()
    ]).then((statuses) => {
      console.log('Channel subscription statuses:', statuses);
      const allSubscribed = statuses.every(status => status === 'SUBSCRIBED');
      setIsConnected(allSubscribed);
      isSubscribedRef.current = allSubscribed;
      
      if (allSubscribed) {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }
    }).catch((error) => {
      console.error('Subscription error:', error);
      setIsConnected(false);
    });

    return () => {
      console.log('Cleaning up realtime subscriptions');
      if (messagesChannelRef.current) {
        supabase.removeChannel(messagesChannelRef.current);
        messagesChannelRef.current = null;
      }
      if (conversationsChannelRef.current) {
        supabase.removeChannel(conversationsChannelRef.current);
        conversationsChannelRef.current = null;
      }
      isSubscribedRef.current = false;
    };
  }, [profile?.id]); // Only depend on profile.id to prevent unnecessary re-runs

  const markMessagesAsRead = (conversationId: string) => {
    setUnreadCount(0);
    setNewMessageNotification(null);
  };

  return {
    messages,
    conversations,
    isConnected,
    unreadCount,
    newMessageNotification,
    setMessages,
    setConversations,
    markMessagesAsRead
  };
};
