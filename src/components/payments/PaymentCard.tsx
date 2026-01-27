
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? '');

interface PaymentCardProps {
  serviceName: string;
  providerName: string;
  totalPrice: number;
  conversationId: string;
  onPaymentSuccess: () => void;
}

const PaymentForm: React.FC<PaymentCardProps> = ({
  serviceName,
  providerName,
  totalPrice,
  conversationId,
  onPaymentSuccess
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // MODELO DE ASSINATURA: O prestador recebe o valor integral.
  // A plataforma monetiza via mensalidade (R$ 149,90/mês).
  const providerAmount = totalPrice;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create escrow payment
      const { data, error } = await supabase.functions.invoke('create-escrow-payment', {
        body: {
          conversationId,
          amount: totalPrice,
          currency: 'BRL'
        }
      });

      if (error) throw error;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      toast({
        title: "Pagamento Realizado!",
        description: "O pagamento foi processado e está em retenção até a conclusão do serviço.",
      });

      onPaymentSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erro no Pagamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar o pagamento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Pagamento Seguro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Serviço:</span>
            <span className="font-medium">{serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span>Prestador:</span>
            <span className="font-medium">{providerName}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>Valor do Serviço:</span>
            <span>R$ {totalPrice.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total a Pagar:</span>
            <span>R$ {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Pagamento em Retenção</p>
              <p>O valor será liberado ao prestador após a confirmação do serviço por ambas as partes.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 border rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!stripe || loading}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {loading ? 'Processando...' : `Pagar R$ ${totalPrice.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export const PaymentCard: React.FC<PaymentCardProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};
