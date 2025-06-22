
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface Chat {
  id: string;
  cliente_id: string;
  prestador_id: string;
  created_at: string;
  last_message?: string;
  cliente?: {
    nome: string;
    foto_url?: string;
  };
  prestador?: {
    nome: string;
    foto_url?: string;
  };
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      loadChats();
    }
  }, [profile]);

  const loadChats = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          cliente:users!chats_cliente_id_fkey (nome, foto_url),
          prestador:users!chats_prestador_id_fkey (nome, foto_url)
        `)
        .or(`cliente_id.eq.${profile.id},prestador_id.eq.${profile.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (chat: Chat, content: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chat.id,
          sender_id: profile.id,
          content,
        });

      if (error) throw error;
      
      // Recarregar mensagens
      await loadMessages(chat.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createChat = async (prestadorId: string) => {
    if (!profile) return null;

    try {
      // Verificar se já existe um chat entre estes usuários
      const { data: existingChat } = await supabase
        .from('chats')
        .select('*')
        .or(`and(cliente_id.eq.${profile.id},prestador_id.eq.${prestadorId}),and(cliente_id.eq.${prestadorId},prestador_id.eq.${profile.id})`)
        .maybeSingle();

      if (existingChat) {
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

      if (error) throw error;

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
