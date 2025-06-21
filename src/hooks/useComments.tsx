
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
          avaliador:avaliador_id (nome, foto_perfil)
        `)
        .eq('avaliado_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
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
