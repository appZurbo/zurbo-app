// Componente de toast simples que não usa React hooks
import { useEffect } from 'react';
import { simpleToast } from '@/utils/simpleToast';

export function SimpleToaster() {
  useEffect(() => {
    // Apenas inicializa o sistema de toast
    // O próprio simpleToast gerencia a renderização via DOM
    console.log('Simple toast system initialized');
  }, []);

  // Não renderiza nada - o toast é injetado diretamente no DOM
  return null;
}