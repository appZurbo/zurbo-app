
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

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
      // For now, we'll use mock data
      // When the chats table is created, we can load from there
      console.log('Loading chats for user:', profile.id);
      setChats([]);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      // For now, we'll use mock data
      // When the messages table is created, we can load from there
      console.log('Loading messages for chat:', chatId);
      setMessages([]);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (chat: Chat, content: string) => {
    if (!profile) return;

    try {
      // For now, we'll just log the message
      // When the messages table is created, we can save there
      console.log('Sending message:', { chat: chat.id, content, sender: profile.id });
      
      // Add message to local state
      const newMessage: Message = {
        id: Date.now().toString(),
        chat_id: chat.id,
        sender_id: profile.id,
        content,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createChat = async (prestadorId: string) => {
    if (!profile) return null;

    try {
      // For now, we'll create a mock chat
      // When the chats table is created, we can save there
      const newChat: Chat = {
        id: Date.now().toString(),
        cliente_id: profile.id,
        prestador_id: prestadorId,
        created_at: new Date().toISOString(),
      };

      setChats(prev => [...prev, newChat]);
      return newChat;
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
