
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  message?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  message = "Esta página é exclusiva para usuários registrados" 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">Z</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
                <p className="text-gray-600 mb-4">{message}</p>
                <Button 
                  onClick={() => navigate('/auth')} 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Criar Conta
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="blur-sm pointer-events-none">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
