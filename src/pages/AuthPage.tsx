
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleSwitchToRegister = () => {
    setActiveTab('register');
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };

  const handleRegisterSuccess = (userType: string) => {
    // After successful registration, switch to login tab
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
                  <LoginForm onSwitchToRegister={handleSwitchToRegister} />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm 
                    onSuccess={handleRegisterSuccess}
                    onSwitchToLogin={handleSwitchToLogin}
                  />
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
