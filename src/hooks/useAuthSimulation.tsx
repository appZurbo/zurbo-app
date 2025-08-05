
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useAuthSimulation = () => {
  const originalAuth = useAuth();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState<'cliente' | 'prestador' | null>(null);

  const enableSimulation = useCallback((role: 'cliente' | 'prestador') => {
    // Só admins podem simular
    if (!originalAuth.isAdmin) return;
    
    setIsSimulating(true);
    setSimulatedRole(role);
  }, [originalAuth.isAdmin]);

  const disableSimulation = useCallback(() => {
    setIsSimulating(false);
    setSimulatedRole(null);
  }, []);

  // Retornar auth modificado se estiver simulando
  if (isSimulating && simulatedRole && originalAuth.isAdmin) {
    return {
      ...originalAuth,
      // Manter privilégios de admin
      isAdmin: true,
      // Simular o tipo de usuário
      isPrestador: simulatedRole === 'prestador',
      isCliente: simulatedRole === 'cliente',
      // Indicadores de simulação
      isSimulating,
      simulatedRole,
      enableSimulation,
      disableSimulation,
    };
  }

  // Retornar auth normal com funções de simulação
  return {
    ...originalAuth,
    isSimulating: false,
    simulatedRole: null,
    enableSimulation,
    disableSimulation,
  };
};
