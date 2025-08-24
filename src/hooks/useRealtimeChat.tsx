
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [conversations, setConversations] = useState<RealtimeConversation[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessageNotification, setNewMessageNotification] = useState<RealtimeMessage | null>(null);
  
  // Use refs to prevent duplicate subscriptions
  const channelsRef = useRef<any[]>([]);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (!profile?.id || isInitializedRef.current) {
      return;
    }

    console.log('Initializing realtime chat for user:', profile.id);
    isInitializedRef.current = true;

    // Clean up any existing channels
    if (channelsRef.current.length > 0) {
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn('Error removing channel:', error);
        }
      });
      channelsRef.current = [];
    }

    // Create unique channel names with timestamp to avoid conflicts
    const timestamp = Date.now();
    const messagesChannelName = `chat-messages-${profile.id}-${timestamp}`;
    const conversationsChannelName = `chat-conversations-${profile.id}-${timestamp}`;

    // Setup messages channel
    const messagesChannel = supabase
      .channel(messagesChannelName)
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
            
            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Nova mensagem no Zurbo', {
                body: newMessage.content?.substring(0, 100) || 'Você recebeu uma nova mensagem',
                icon: '/favicon.ico',
                tag: 'chat-message'
              });
            }
            
            // Toast notification without duration property
            toast.success(`💬 Nova mensagem: ${newMessage.content?.substring(0, 50) + (newMessage.content?.length > 50 ? '...' : '')}`);
            
            // Clear notification after 5 seconds
            setTimeout(() => {
              setNewMessageNotification(null);
            }, 5000);
          }
        }
      );

    // Setup conversations channel
    const conversationsChannel = supabase
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

    // Store channels for cleanup
    channelsRef.current = [messagesChannel, conversationsChannel];

    // Subscribe to channels
    const subscribeChannels = async () => {
      try {
        messagesChannel.subscribe((status) => {
          console.log('Messages channel status:', status);
          if (status === 'SUBSCRIBED') {
            conversationsChannel.subscribe((status) => {
              console.log('Conversations channel status:', status);
              if (status === 'SUBSCRIBED') {
                setIsConnected(true);
              }
            });
          }
        });
        
        console.log('Channel subscriptions initialized');
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
      } catch (error) {
        console.error('Subscription error:', error);
        setIsConnected(false);
      }
    };

    subscribeChannels();

    return () => {
      console.log('Cleaning up realtime subscriptions');
      if (channelsRef.current.length > 0) {
        channelsRef.current.forEach(channel => {
          try {
            supabase.removeChannel(channel);
          } catch (error) {
            console.warn('Error during cleanup:', error);
          }
        });
        channelsRef.current = [];
      }
      isInitializedRef.current = false;
    };
  }, [profile?.id]); // Only depend on profile.id

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
