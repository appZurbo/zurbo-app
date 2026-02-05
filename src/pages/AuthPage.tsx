import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecureEnhancedLoginForm } from '@/components/auth/SecureEnhancedLoginForm';
import { SecureEnhancedRegisterForm } from '@/components/auth/SecureEnhancedRegisterForm';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  // Verificar se há parâmetro na URL para abrir na aba de cadastro
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [searchParams]);

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
    <UnifiedLayout showDock={false} showHeader={false}>
      <div className="min-h-[100dvh] bg-[#FBF7F2] relative overflow-hidden flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-yellow-100/30 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo Section */}
          <div className="text-center mb-10">
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              src="/newlogo.png"
              alt="Zurbo Logo"
              className="h-12 md:h-16 mx-auto mb-4 drop-shadow-sm"
            />
            <p className="text-gray-500 font-medium tracking-tight">Sua casa em boas mãos.</p>
          </div>

          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8">
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as 'login' | 'register')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1.5 rounded-2xl mb-8 border border-gray-200/50">
                  <TabsTrigger
                    value="login"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all py-3 font-bold"
                  >
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all py-3 font-bold"
                  >
                    Cadastrar
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TabsContent value="login" className="mt-0 outline-none">
                      <SecureEnhancedLoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />
                    </TabsContent>

                    <TabsContent value="register" className="mt-0 outline-none">
                      <SecureEnhancedRegisterForm onSuccess={handleRegisterSuccess} onSwitchToLogin={handleSwitchToLogin} />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="text-center mt-10 space-y-4">
            <p className="text-gray-400 text-sm">
              Ao continuar, você concorda com nossos <br />
              <a href="/termos-uso" className="underline font-medium hover:text-orange-500 transition-colors">Termos de Serviço</a> e <a href="/politica-privacidade" className="underline font-medium hover:text-orange-500 transition-colors">Política de Privacidade</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </UnifiedLayout>
  );
};

export default AuthPage;
