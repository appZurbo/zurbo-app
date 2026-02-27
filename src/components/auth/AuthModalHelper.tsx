import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';

interface AuthButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  variant = 'default',
  className = '',
  size = 'default'
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        className={className}
        size={size}
        onClick={() => setShowAuthModal(true)}
      >
        {children}
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => { }}
      />
    </>
  );
};

export default AuthButton;