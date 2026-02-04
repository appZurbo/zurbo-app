import { UserProfile } from '@/types';

/**
 * Verifica se o usuário precisa completar o onboarding
 * Baseado em:
 * - Perfil criado recentemente (últimas 48 horas)
 * - Campos importantes vazios (cidade)
 * - Para prestadores: falta serviços cadastrados
 */
export const needsOnboarding = (profile: UserProfile | null): boolean => {
  if (!profile) return false;

  // Verificar se já completou onboarding (marcado no localStorage)
  const onboardingCompleted = localStorage.getItem(`onboarding_completed_${profile.id}`);
  if (onboardingCompleted === 'true') {
    return false;
  }

  // Verificar campos obrigatórios básicos
  const faltaCidade = !profile.endereco_cidade || profile.endereco_cidade.trim() === '';
  
  // Para prestadores, verificar se tem serviços cadastrados
  let faltaServicos = false;
  if (profile.tipo === 'prestador') {
    faltaServicos = !profile.prestador_servicos || profile.prestador_servicos.length === 0;
  }

  // Se falta cidade OU (para prestadores) falta serviços, precisa de onboarding
  if (faltaCidade || faltaServicos) {
    // Verificar se foi criado recentemente (últimas 48 horas) para evitar redirecionar usuários antigos
    const criadoEm = profile.criado_em || profile.created_at;
    if (criadoEm) {
      const criadoDate = new Date(criadoEm);
      const agora = new Date();
      const horasDesdeCriacao = (agora.getTime() - criadoDate.getTime()) / (1000 * 60 * 60);
      
      // Se foi criado há menos de 48 horas, precisa de onboarding
      if (horasDesdeCriacao < 48) {
        return true;
      }
    } else {
      // Se não tem data de criação, assumir que precisa de onboarding
      return true;
    }
  }

  return false;
};

/**
 * Marca o onboarding como completo para um usuário
 */
export const markOnboardingCompleted = (userId: string) => {
  localStorage.setItem(`onboarding_completed_${userId}`, 'true');
};

/**
 * Remove a marcação de onboarding completo (útil para testes)
 */
export const clearOnboardingCompleted = (userId: string) => {
  localStorage.removeItem(`onboarding_completed_${userId}`);
};
