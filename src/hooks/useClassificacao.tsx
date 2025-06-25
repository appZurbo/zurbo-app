
import { useState, useEffect } from 'react';
import { verificarClassificacao, atualizarClassificacoes, ClassificacaoPrestador } from '@/utils/database/classificacao';

export const useClassificacao = (prestadorId?: string) => {
  const [classificacao, setClassificacao] = useState<ClassificacaoPrestador | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prestadorId) {
      carregarClassificacao();
    }
  }, [prestadorId]);

  const carregarClassificacao = async () => {
    if (!prestadorId) return;
    
    setLoading(true);
    try {
      const result = await verificarClassificacao(prestadorId);
      setClassificacao(result);
    } catch (error) {
      console.error('Error loading classificacao:', error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarTodasClassificacoes = async () => {
    setLoading(true);
    try {
      await atualizarClassificacoes();
    } catch (error) {
      console.error('Error updating classificacoes:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    classificacao,
    loading,
    carregarClassificacao,
    atualizarTodasClassificacoes
  };
};
