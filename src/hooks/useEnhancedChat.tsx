
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChatConversation, ChatMessage } from '@/types';

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

  // Load conversations using optimized RPC function
  const loadConversations = useCallback(async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_conversations_with_last_message', {
          user_id_param: profile.id
        });

      if (error) throw error;

      const formattedConversations = (data || []).map(conv => ({
        ...conv,
        status: conv.status as ChatConversation['status'],
        cliente: { nome: conv.cliente_nome, foto_url: conv.cliente_foto_url },
        prestador: { nome: conv.prestador_nome, foto_url: conv.prestador_foto_url },
        last_message: conv.last_message_content || 'Nova conversa'
      })) as ChatConversation[];

      setConversations(formattedConversations);
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
      .channel(`messages-${currentConversation.id}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${currentConversation.id}`
        },
        (payload) => {
          console.log('Real-time message received:', payload);
          const newMessage = {
            ...payload.new,
            message_type: payload.new.message_type as ChatMessage['message_type']
          } as ChatMessage;
          
          setMessages(prev => {
            // Prevent duplicates
            const exists = prev.find(m => m.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe((status) => {
        console.log('Messages channel status:', status);
      });

    return () => {
      console.log('Removing messages channel');
      supabase.removeChannel(channel);
    };
  }, [currentConversation]);

  // Setup realtime subscription for conversations
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel(`conversations-${profile.id}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations'
        },
        (payload) => {
          console.log('Real-time conversation update:', payload);
          // Reload conversations using our optimized RPC
          loadConversations();
        }
      )
      .subscribe((status) => {
        console.log('Conversations channel status:', status);
      });

    return () => {
      console.log('Removing conversations channel');
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
