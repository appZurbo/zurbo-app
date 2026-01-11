
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecureEnhancedLoginForm } from './auth/SecureEnhancedLoginForm';
import { SecureEnhancedRegisterForm } from './auth/SecureEnhancedRegisterForm';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
  defaultTab?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, onLogin, defaultTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleSuccess = () => {
    onLogin({});
    onClose();
  };

  const handleTabChange = (value: string) => {
    if (value === 'login' || value === 'register') {
      setActiveTab(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-0 top-0 h-auto p-1"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <img
              src="/logoinv.png"
              alt="Zurbo Logo"
              className="w-32 h-auto mx-auto mb-4"
            />
            <p className="text-gray-600 mt-1">Conectando você aos melhores profissionais</p>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-6">
            <SecureEnhancedLoginForm
              onSuccess={handleSuccess}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          </TabsContent>
          
          <TabsContent value="register" className="mt-6">
            <SecureEnhancedRegisterForm
              onSuccess={() => setActiveTab('login')}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
