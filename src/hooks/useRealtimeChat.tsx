
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!profile) return;

    console.log('Setting up realtime chat for user:', profile.id);

    // Setup realtime subscription for messages
    const messagesChannel = supabase
      .channel('chat-messages')
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
          
          // Add message to state
          setMessages(prev => [...prev, newMessage]);
          
          // Show notification if message is from another user
          if (newMessage.sender_id !== profile.id) {
            setUnreadCount(prev => prev + 1);
            setNewMessageNotification(newMessage);
            
            // Show toast notification
            toast({
              title: "Nova mensagem",
              description: newMessage.content?.substring(0, 50) + (newMessage.content?.length > 50 ? '...' : ''),
              duration: 3000,
            });
            
            // Clear notification after 5 seconds
            setTimeout(() => {
              setNewMessageNotification(null);
            }, 5000);
          }
        }
      )
      .subscribe((status) => {
        console.log('Messages channel status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Setup realtime subscription for conversations
    const conversationsChannel = supabase
      .channel('chat-conversations')  
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
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
    };
  }, [profile, toast]);

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
