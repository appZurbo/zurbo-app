
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types';
import { logger } from '@/utils/logger';

// Chat interface with simplified user info for this hook
interface ChatWithUsers {
  id: string;
  cliente_id: string;
  prestador_id: string;
  last_message?: string;
  created_at: string;
  updated_at: string;
  cliente?: { nome: string; foto_url?: string };
  prestador?: { nome: string; foto_url?: string };
}

export const useChat = () => {
  const [chats, setChats] = useState<ChatWithUsers[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatWithUsers | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      loadChats();
    }
  }, [profile]);

  // Setup realtime subscription for messages
  useEffect(() => {
    if (!currentChat) return;

    logger.log('Setting up realtime subscription for chat:', currentChat.id);

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${currentChat.id}`
        },
        (payload) => {
          logger.log('New message received:', payload);
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe((status) => {
        logger.log('Realtime subscription status:', status);
      });

    return () => {
      logger.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [currentChat]);

  const loadChats = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      logger.log('Loading chats for profile:', profile.id);
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          cliente:users!chats_cliente_id_fkey (nome, foto_url),
          prestador:users!chats_prestador_id_fkey (nome, foto_url)
        `)
        .or(`cliente_id.eq.${profile.id},prestador_id.eq.${profile.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        logger.error('Error loading chats:', error);
        throw error;
      }
      
      logger.log('Loaded chats:', data);
      setChats(data || []);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      logger.log('Loading messages for chat:', chatId);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        throw error;
      }
      
      logger.log('Loaded messages:', data);
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (chat: ChatWithUsers, content: string) => {
    if (!profile || !content.trim()) {
      logger.log('Cannot send message - missing profile or content');
      return;
    }

    try {
      logger.log('Sending message:', { chatId: chat.id, content, senderId: profile.id });
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chat.id,
          sender_id: profile.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      logger.log('Message sent successfully:', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createChat = async (prestadorId: string) => {
    if (!profile) {
      logger.log('Cannot create chat - no profile');
      return null;
    }

    try {
      logger.log('Creating chat between:', profile.id, 'and', prestadorId);
      
      // Verificar se já existe um chat entre estes usuários
      const { data: existingChat } = await supabase
        .from('chats')
        .select('*')
        .or(`and(cliente_id.eq.${profile.id},prestador_id.eq.${prestadorId}),and(cliente_id.eq.${prestadorId},prestador_id.eq.${profile.id})`)
        .maybeSingle();

      if (existingChat) {
        logger.log('Chat already exists:', existingChat);
        return existingChat;
      }

      const { data, error } = await supabase
        .from('chats')
        .insert({
          cliente_id: profile.id,
          prestador_id: prestadorId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating chat:', error);
        throw error;
      }

      logger.log('Chat created successfully:', data);
      await loadChats();
      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  return {
    chats,
    currentChat,
    messages,
    loading,
    setCurrentChat,
    loadMessages,
    sendMessage,
    createChat,
  };
};
