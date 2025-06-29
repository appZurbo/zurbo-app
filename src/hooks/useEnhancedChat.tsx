
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChatConversation {
  id: string;
  cliente_id: string;
  prestador_id: string;
  servico_solicitado: string;
  preco_proposto?: number;
  status: 'aguardando_preco' | 'preco_definido' | 'aceito' | 'rejeitado' | 'pagamento_retido' | 'em_andamento' | 'concluido' | 'cancelado' | 'bloqueado';
  pedido_id?: string;
  created_at: string;
  updated_at: string;
  client_message_count?: number;
  provider_message_count?: number;
  cliente?: { nome: string; foto_url?: string };
  prestador?: { nome: string; foto_url?: string };
  last_message?: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: 'text' | 'image' | 'system';
  content?: string;
  image_url?: string;
  created_at: string;
}

export interface ImageUploadInfo {
  remaining: number;
  total: number;
}

export const useEnhancedChat = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageUploadInfo, setImageUploadInfo] = useState<ImageUploadInfo>({ remaining: 5, total: 5 });
  const { profile } = useAuth();
  const { toast } = useToast();

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          cliente:users!chat_conversations_cliente_id_fkey (nome, foto_url),
          prestador:users!chat_conversations_prestador_id_fkey (nome, foto_url)
        `)
        .or(`cliente_id.eq.${profile.id},prestador_id.eq.${profile.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Get last message for each conversation
      const conversationsWithLastMessage = await Promise.all(
        (data || []).map(async (conv) => {
          const { data: lastMsg } = await supabase
            .from('chat_messages')
            .select('content')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          return {
            ...conv,
            status: conv.status as ChatConversation['status'],
            last_message: lastMsg?.content || 'Nova conversa'
          } as ChatConversation;
        })
      );
      
      setConversations(conversationsWithLastMessage);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [profile, toast]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const typedMessages = (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as ChatMessage['message_type']
      })) as ChatMessage[];
      
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Create or find conversation
  const createConversation = useCallback(async (prestadorId: string, servico: string) => {
    if (!profile) return null;

    try {
      // Check if conversation exists
      const { data: existing } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('cliente_id', profile.id)
        .eq('prestador_id', prestadorId)
        .single();

      if (existing) {
        return existing;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          cliente_id: profile.id,
          prestador_id: prestadorId,
          servico_solicitado: servico,
          status: 'aguardando_preco'
        })
        .select()
        .single();

      if (error) throw error;
      
      await loadConversations();
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a conversa.",
        variant: "destructive"
      });
      return null;
    }
  }, [profile, loadConversations, toast]);

  // Send message
  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: profile.id,
          message_type: 'text',
          content
        });

      if (error) throw error;
      // Real-time updates will handle adding the message to the UI
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive"
      });
    }
  }, [profile, toast]);

  // Upload image
  const uploadImage = useCallback(async (conversationId: string, file: File) => {
    if (!profile) return;

    try {
      // Check daily limit
      const today = new Date().toISOString().split('T')[0];
      const { data: uploadData } = await supabase
        .from('daily_image_uploads')
        .select('upload_count')
        .eq('user_id', profile.id)
        .eq('upload_date', today)
        .single();

      const currentCount = uploadData?.upload_count || 0;
      if (currentCount >= 5) {
        toast({
          title: "Limite atingido",
          description: "Você atingiu o limite de 5 imagens por dia.",
          variant: "destructive"
        });
        return;
      }

      // Upload to storage
      const fileName = `${profile.id}/${Date.now()}-${file.name}`;
      const { data: uploadResult, error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      // Save message
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: profile.id,
          message_type: 'image',
          image_url: publicUrl
        });

      if (messageError) throw messageError;

      // Update upload count
      await supabase
        .from('daily_image_uploads')
        .upsert({
          user_id: profile.id,
          upload_date: today,
          upload_count: currentCount + 1
        });

      setImageUploadInfo({ remaining: 4 - currentCount, total: 5 });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a imagem.",
        variant: "destructive"
      });
    }
  }, [profile, toast]);

  // Set price
  const setPrice = useCallback(async (conversationId: string, price: number) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({
          preco_proposto: price,
          status: 'preco_definido'
        })
        .eq('id', conversationId);

      if (error) throw error;
      
      // Send system message
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: profile?.id,
          message_type: 'system',
          content: `Preço definido: R$ ${price.toFixed(2)}`
        });

      await loadConversations();
      toast({
        title: "Sucesso",
        description: "Preço definido com sucesso!",
      });
    } catch (error) {
      console.error('Error setting price:', error);
      toast({
        title: "Erro",
        description: "Não foi possível definir o preço.",
        variant: "destructive"
      });
    }
  }, [profile, loadConversations, toast]);

  // Accept/Reject price
  const respondToPrice = useCallback(async (conversationId: string, accept: boolean) => {
    try {
      const newStatus = accept ? 'aceito' : 'rejeitado';
      const { error } = await supabase
        .from('chat_conversations')
        .update({ status: newStatus })
        .eq('id', conversationId);

      if (error) throw error;

      // Send system message
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: profile?.id,
          message_type: 'system',
          content: accept ? 'Preço aceito! Aguardando pagamento.' : 'Preço rejeitado.'
        });

      await loadConversations();
      toast({
        title: "Sucesso",
        description: accept ? "Preço aceito! Cliente pode pagar agora." : "Preço rejeitado.",
      });
    } catch (error) {
      console.error('Error responding to price:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a resposta.",
        variant: "destructive"
      });
    }
  }, [profile, loadConversations, toast]);

  // Report user
  const reportUser = useCallback(async (conversationId: string, reportedUserId: string, issueType: string, description: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('user_chat_reports')
        .insert({
          reporter_id: profile.id,
          reported_user_id: reportedUserId,
          conversation_id: conversationId,
          issue_type: issueType,
          description
        });

      if (error) throw error;

      // Block conversation
      await supabase
        .from('chat_conversations')
        .update({ status: 'bloqueado' })
        .eq('id', conversationId);

      // Send system message
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: profile.id,
          message_type: 'system',
          content: 'Conversa bloqueada devido a denúncia.'
        });

      await loadConversations();
      toast({
        title: "Denúncia enviada",
        description: "A conversa foi bloqueada e a denúncia enviada para moderação.",
      });
    } catch (error) {
      console.error('Error reporting user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a denúncia.",
        variant: "destructive"
      });
    }
  }, [profile, loadConversations, toast]);

  // Load image upload info
  const loadImageUploadInfo = useCallback(async () => {
    if (!profile) return;

    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_image_uploads')
      .select('upload_count')
      .eq('user_id', profile.id)
      .eq('upload_date', today)
      .single();

    const used = data?.upload_count || 0;
    setImageUploadInfo({ remaining: 5 - used, total: 5 });
  }, [profile]);

  // Setup realtime subscription for messages
  useEffect(() => {
    if (!currentConversation) return;

    const channel = supabase
      .channel(`conversation-${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${currentConversation.id}`
        },
        (payload) => {
          const newMessage = {
            ...payload.new,
            message_type: payload.new.message_type as ChatMessage['message_type']
          } as ChatMessage;
          
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversation]);

  // Setup realtime subscription for conversations
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations'
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, loadConversations]);

  useEffect(() => {
    if (profile) {
      loadConversations();
      loadImageUploadInfo();
    }
  }, [profile, loadConversations, loadImageUploadInfo]);

  return {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    loading,
    imageUploadInfo,
    loadConversations,
    loadMessages,
    createConversation,
    sendMessage,
    uploadImage,
    setPrice,
    respondToPrice,
    reportUser
  };
};
