import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthSecurity } from '@/hooks/useAuthSecurity';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  onEmailConfirmed?: () => void;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  onClose,
  email: initialEmail = '',
  onEmailConfirmed
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [lastResendTime, setLastResendTime] = useState<Date | null>(null);
  const { resendConfirmation } = useAuthSecurity();
  const { toast } = useToast();

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Digite seu email para reenviar a confirmação.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    
    try {
      const result = await resendConfirmation(email);
      
      if (result.success) {
        setResendCount(prev => prev + 1);
        setLastResendTime(new Date());
        
        toast({
          title: "Email reenviado com sucesso!",
          description: "Verifique sua caixa de entrada e spam.",
        });
      } else {
        toast({
          title: "Erro ao reenviar email",
          description: result.error || "Tente novamente em alguns minutos.",
          variant: "destructive",
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  const canResend = () => {
    if (!lastResendTime) return true;
    const timeSinceLastResend = Date.now() - lastResendTime.getTime();
    return timeSinceLastResend > 60000; // 1 minuto entre reenvios
  };

  const getResendButtonText = () => {
    if (isResending) return "Reenviando...";
    if (resendCount === 0) return "Reenviar email de confirmação";
    if (!canResend()) return "Aguarde 1 minuto para reenviar";
    return `Reenviar novamente (${resendCount})`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Confirme seu email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                Para sua segurança, enviamos um email de confirmação para:
              </p>
              <p className="font-medium text-foreground mt-1">{email}</p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 inline mr-2 text-green-600" />
              Clique no link do email para ativar sua conta
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="email-resend">Email para reenvio</Label>
              <Input
                id="email-resend"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleResendConfirmation}
              disabled={!email || isResending || !canResend()}
              className="w-full"
              variant="outline"
            >
              {isResending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              {getResendButtonText()}
            </Button>
          </div>

          {resendCount > 0 && (
            <div className="text-xs text-muted-foreground text-center p-2 bg-green-50 rounded">
              ✓ Email reenviado {resendCount} vez(es). Verifique sua caixa de entrada e spam.
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Verifique sua caixa de entrada e pasta de spam</p>
            <p>• O link de confirmação expira em 24 horas</p>
            <p>• Caso não receba, verifique se o email está correto</p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Fechar
            </Button>
            {onEmailConfirmed && (
              <Button 
                onClick={onEmailConfirmed}
                className="flex-1"
              >
                Já confirmei
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};