
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface RealtimeMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  message_type: string;
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
          setMessages(prev => [...prev, newMessage]);
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
  }, [profile]);

  return {
    messages,
    conversations,
    isConnected,
    setMessages,
    setConversations
  };
};
