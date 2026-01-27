import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecureEnhancedLoginForm } from '@/components/auth/SecureEnhancedLoginForm';
import { SecureEnhancedRegisterForm } from '@/components/auth/SecureEnhancedRegisterForm';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleSwitchToRegister = () => {
    setActiveTab('register');
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };

  const handleLoginSuccess = () => {
    navigate('/', { replace: true });
  };

  const handleRegisterSuccess = () => {
    setActiveTab('login');
  };

  return (
    <UnifiedLayout showDock={false}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Acesse sua conta</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Cadastrar</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <SecureEnhancedLoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />
                </TabsContent>
                <TabsContent value="register">
                  <SecureEnhancedRegisterForm onSuccess={handleRegisterSuccess} onSwitchToLogin={handleSwitchToLogin} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default AuthPage;
