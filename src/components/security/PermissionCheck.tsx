
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface PermissionCheckProps {
  children: ReactNode;
  requiredRole?: 'cliente' | 'prestador' | 'admin' | 'moderator';
  allowedRoles?: string[];
  requireAuth?: boolean;
  fallback?: ReactNode;
  userId?: string; // Para verificar se é o próprio usuário
}

const PermissionCheck = ({ 
  children, 
  requiredRole, 
  allowedRoles, 
  requireAuth = false,
  fallback = null,
  userId
}: PermissionCheckProps) => {
  const { profile, isAuthenticated, isAdmin } = useAuth();

  // Verificar se precisa estar logado
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // Verificar se é o próprio usuário
  if (userId && profile?.id !== userId && !isAdmin) {
    return <>{fallback}</>;
  }

  // Verificar role específico
  if (requiredRole && profile?.tipo !== requiredRole && !isAdmin) {
    return <>{fallback}</>;
  }

  // Verificar roles permitidos
  if (allowedRoles && profile?.tipo && !allowedRoles.includes(profile.tipo) && !isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionCheck;
