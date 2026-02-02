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
      console.log('⏳ Aguardando perfil ser carregado...');
      return;
    }

    // Verificar se precisa de onboarding
    const needsOnboardingCheck = needsOnboarding(profile);
    console.log('🔍 Verificação de onboarding:', {
      profileId: profile.id,
      email: profile.email,
      cidade: profile.endereco_cidade,
      tipo: profile.tipo,
      criadoEm: profile.criado_em,
      needsOnboarding: needsOnboardingCheck
    });

    if (needsOnboardingCheck) {
      console.log('🔄 Usuário precisa completar onboarding, redirecionando...');
      navigate('/onboarding', { replace: true });
    }
  }, [profile, loading, isAuthenticated, location.pathname, navigate]);

  return <>{children}</>;
};
