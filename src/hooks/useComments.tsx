
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Comment {
  id: string;
  avaliador_id: string;
  avaliado_id: string;
  comentario: string;
  avaliacao: number;
  created_at: string;
  avaliador?: {
    nome: string;
    foto_perfil?: string;
  };
}

export const useComments = (userId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  const loadComments = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .select(`
          *,
          avaliador:users!comentarios_avaliador_id_fkey (nome, foto_perfil)
        `)
        .eq('avaliado_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(comment => ({
        ...comment,
        avaliador: comment.avaliador ? {
          nome: comment.avaliador.nome,
          foto_perfil: comment.avaliador.foto_perfil
        } : undefined
      }));

      setComments(transformedData);
    } catch (error: any) {
      console.error('Erro ao carregar comentários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os comentários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (avaliadoId: string, comentario: string, avaliacao: number) => {
    if (!profile) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para comentar",
        variant: "destructive",
      });
      return false;
    }

    // Verificar se o usuário já comentou sobre esta pessoa
    try {
      const { data: existingComment } = await supabase
        .from('comentarios')
        .select('id')
        .eq('avaliador_id', profile.id)
        .eq('avaliado_id', avaliadoId)
        .maybeSingle();

      if (existingComment) {
        toast({
          title: "Avaliação já existe",
          description: "Você já avaliou este usuário",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar comentário existente:', error);
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comentarios')
        .insert([{
          avaliador_id: profile.id,
          avaliado_id: avaliadoId,
          comentario,
          avaliacao
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Comentário adicionado com sucesso",
      });

      // Recarregar comentários se estamos na mesma página
      if (userId === avaliadoId) {
        await loadComments();
      }

      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar comentário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [userId]);

  return {
    comments,
    loading,
    submitting,
    addComment,
    refreshComments: loadComments
  };
};
