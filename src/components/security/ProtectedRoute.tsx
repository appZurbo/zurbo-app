import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requirePrestador?: boolean;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

/**
 * Wraps routes that require specific auth/role. Redirects when the user
 * does not match (e.g. not logged in, or missing admin/prestador role).
 */
export function ProtectedRoute({
  children,
  requireAdmin,
  requirePrestador,
  requireAuth,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isPrestador, loading } = useAuth();

  if (loading) {
    return fallback ?? (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requirePrestador && !isPrestador) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
