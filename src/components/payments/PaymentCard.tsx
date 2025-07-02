
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield, AlertCircle } from 'lucide-react';
import { useEscrowPayment } from '@/hooks/useEscrowPayment';

interface PaymentCardProps {
  serviceName: string;
  providerName: string;
  totalPrice: number;
  conversationId: string;
  onPaymentSuccess?: () => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  serviceName,
  providerName,
  totalPrice,
  conversationId,
  onPaymentSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const { createEscrowPayment } = useEscrowPayment();

  const zurboFee = totalPrice * 0.05;
  const netAmount = totalPrice - zurboFee;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const result = await createEscrowPayment(conversationId, totalPrice, 'BRL');
      
      if (result?.checkout_url) {
        window.open(result.checkout_url, '_blank');
        onPaymentSuccess?.();
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pagamento Seguro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Serviço:</span>
            <span>{serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Prestador:</span>
            <span>{providerName}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Valor do Serviço:</span>
            <span>R$ {totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Taxa Zurbo (5%):</span>
            <span>- R$ {zurboFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Valor para o Prestador:</span>
            <span>R$ {netAmount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total a Pagar:</span>
            <span>R$ {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Pagamento Protegido</p>
              <p>Seu pagamento é mantido em segurança e liberado apenas quando o serviço for concluído.</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handlePayment}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Processando...' : 'Pagar com Segurança'}
        </Button>

        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
          <AlertCircle className="h-3 w-3" />
          <span>Processado via Stripe - Seus dados estão seguros</span>
        </div>
      </CardContent>
    </Card>
  );
};
