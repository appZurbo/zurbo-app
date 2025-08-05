import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

type UserType = 'cliente' | 'prestador' | 'admin';

interface UseAuthSimulation {
  isSimulating: boolean;
  simulatedUserType: UserType;
  enableSimulation: (userType: UserType) => void;
  disableSimulation: () => void;
  getEffectiveUserType: () => UserType;
  isEffectivelyPrestador: () => boolean;
  isEffectivelyCliente: () => boolean;
  isEffectivelyAdmin: () => boolean;
}

export const useAuthSimulation = (): UseAuthSimulation => {
  const { profile } = useAuth();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedUserType, setSimulatedUserType] = useState<UserType>('cliente');

  const enableSimulation = useCallback((userType: UserType) => {
    // Only admins can simulate
    if (profile?.tipo !== 'admin') return;
    
    setSimulatedUserType(userType);
    setIsSimulating(true);
    console.log(`🎭 Admin simulation enabled: ${userType}`);
  }, [profile]);

  const disableSimulation = useCallback(() => {
    setIsSimulating(false);
    console.log('🎭 Admin simulation disabled');
  }, []);

  const getEffectiveUserType = useCallback((): UserType => {
    if (!profile) return 'cliente';
    
    // If admin is simulating, return simulated type
    if (profile.tipo === 'admin' && isSimulating) {
      return simulatedUserType;
    }
    
    // Otherwise return actual user type
    return profile.tipo as UserType;
  }, [profile, isSimulating, simulatedUserType]);

  const isEffectivelyPrestador = useCallback(() => {
    return getEffectiveUserType() === 'prestador';
  }, [getEffectiveUserType]);

  const isEffectivelyCliente = useCallback(() => {
    return getEffectiveUserType() === 'cliente';
  }, [getEffectiveUserType]);

  const isEffectivelyAdmin = useCallback(() => {
    // Admin always has admin privileges, even when simulating
    return profile?.tipo === 'admin';
  }, [profile]);

  return {
    isSimulating: profile?.tipo === 'admin' ? isSimulating : false,
    simulatedUserType,
    enableSimulation,
    disableSimulation,
    getEffectiveUserType,
    isEffectivelyPrestador,
    isEffectivelyCliente,
    isEffectivelyAdmin
  };
};
