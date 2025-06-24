
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { AlertCircle } from 'lucide-react';

const AuthPage = () => {
  const { isAuthenticated, loading, error } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Erro de Autenticação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
            >
              Tentar Novamente
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-3xl">Z</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ZURBO</h1>
          <p className="text-white/80">Conectando você aos melhores profissionais</p>
        </div>
        
        <Card className="w-full shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Acesse sua conta</CardTitle>
            <CardDescription className="text-center">
              Entre ou cadastre-se no ZURBO de forma segura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm
                  onSuccess={() => {}}
                  onSwitchToRegister={() => setActiveTab('register')}
                />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm
                  onSuccess={() => {}}
                  onSwitchToLogin={() => setActiveTab('login')}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
