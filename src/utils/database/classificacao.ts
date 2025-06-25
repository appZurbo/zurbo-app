
import { supabase } from '@/integrations/supabase/client';

export interface ClassificacaoPrestador {
  id: string;
  prestador_id: string;
  tipo: 'destaque' | 'padrao';
  criado_em: string;
  atualizado_em: string;
}

export const verificarClassificacao = async (prestadorId: string): Promise<ClassificacaoPrestador | null> => {
  try {
    const { data, error } = await supabase
      .from('classificacao_prestadores')
      .select('*')
      .eq('prestador_id', prestadorId)
      .maybeSingle();

    if (error) {
      console.error('Error checking classificacao:', error);
      return null;
    }

    if (!data) return null;

    // Type casting para garantir que o tipo está correto
    return {
      ...data,
      tipo: data.tipo as 'destaque' | 'padrao'
    } as ClassificacaoPrestador;
  } catch (error) {
    console.error('Error loading classificacao:', error);
    return null;
  }
};

export const atualizarClassificacoes = async (): Promise<void> => {
  try {
    // Buscar prestadores com nota >= 4.0 e pelo menos 10 serviços concluídos
    const { data: prestadoresElegiveis, error: prestadoresError } = await supabase
      .from('users')
      .select(`
        id,
        nota_media,
        prestador_servicos!inner(*)
      `)
      .eq('tipo', 'prestador')
      .gte('nota_media', 4.0);

    if (prestadoresError) throw prestadoresError;

    for (const prestador of prestadoresElegiveis || []) {
      // Contar serviços concluídos
      const { count: servicosConcluidos } = await supabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true })
        .eq('prestador_id', prestador.id)
        .eq('status', 'concluido');

      if ((servicosConcluidos || 0) >= 10) {
        // Verificar se já tem classificação
        const classificacaoExistente = await verificarClassificacao(prestador.id);

        if (!classificacaoExistente) {
          // Criar nova classificação como destaque
          await supabase
            .from('classificacao_prestadores')
            .insert({
              prestador_id: prestador.id,
              tipo: 'destaque'
            });
        } else if (classificacaoExistente.tipo !== 'destaque') {
          // Atualizar para destaque
          await supabase
            .from('classificacao_prestadores')
            .update({ 
              tipo: 'destaque',
              atualizado_em: new Date().toISOString()
            })
            .eq('prestador_id', prestador.id);
        }
      }
    }
  } catch (error) {
    console.error('Error updating classificacoes:', error);
  }
};
