
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender?: {
    nome: string;
    foto_url?: string;
  };
}

interface Chat {
  id: string;
  cliente_id: string;
  prestador_id: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  cliente?: {
    nome: string;
    foto_url?: string;
  };
  prestador?: {
    nome: string;
    foto_url?: string;
  };
}

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const loadChats = useCallback(async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          cliente:users!chats_cliente_id_fkey (nome, foto_url),
          prestador:users!chats_prestador_id_fkey (nome, foto_url)
        `)
        .or(`cliente_id.eq.${profile.id},prestador_id.eq.${profile.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const loadMessages = useCallback(async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey (nome, foto_url)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  const sendMessage = async (chatId: string, message: string) => {
    if (!profile || !message.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: profile.id,
          message: message.trim(),
        });

      if (error) throw error;

      // Update chat's last message
      await supabase
        .from('chats')
        .update({
          last_message: message.trim(),
          last_message_at: new Date().toISOString(),
        })
        .eq('id', chatId);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createChat = async (prestadorId: string, clienteId: string) => {
    try {
      // Check if chat already exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('prestador_id', prestadorId)
        .eq('cliente_id', clienteId)
        .single();

      if (existingChat) {
        return existingChat.id;
      }

      // Create new chat
      const { data, error } = await supabase
        .from('chats')
        .insert({
          prestador_id: prestadorId,
          cliente_id: clienteId,
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat);

      // Subscribe to new messages
      const channel = supabase
        .channel(`messages:${currentChat}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chat_id=eq.${currentChat}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentChat, loadMessages]);

  return {
    chats,
    messages,
    currentChat,
    loading,
    setCurrentChat,
    sendMessage,
    createChat,
    refreshChats: loadChats,
  };
};
