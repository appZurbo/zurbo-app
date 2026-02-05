import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { needsOnboarding } from '@/utils/onboarding';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

/**
 * Componente que verifica se o usuário precisa completar onboarding
 * e redireciona automaticamente se necessário
 */
export const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Não verificar se:
    // - Está carregando
    // - Não está autenticado
    // - Já está na página de onboarding
    // - Está na página de auth
    if (loading || !isAuthenticated) {
      return;
    }

    const isOnboardingPage = location.pathname === '/onboarding';
    const isAuthPage = location.pathname === '/auth';

    if (isOnboardingPage || isAuthPage) {
      return;
    }

    // Se não tem perfil ainda, aguardar (pode estar sendo criado)
    if (!profile) {

      return;
    }

    // Verificar se precisa de onboarding
    const needsOnboardingCheck = needsOnboarding(profile);


    if (needsOnboardingCheck) {

      navigate('/onboarding', { replace: true });
    }
  }, [profile, loading, isAuthenticated, location.pathname, navigate]);

  return <>{children}</>;
};
