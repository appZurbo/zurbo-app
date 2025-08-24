
import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardElement,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner';

const stripePromise = loadStripe('pk_test_51RgcAS04BC4Rs3cN4wgSUBWK7AY9ODRrarFjB9tsBJTSjUTciHaGttkkxXL49Ugq1mNiFjYUGP0QTgLVdvsl');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding: '12px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  amount,
  onSuccess,
  onError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.error('Payment error:', error);
        onError(error.message || 'Erro no pagamento');
        toast.error(error.message || 'Não foi possível processar o pagamento.');
      } else if (paymentIntent?.status === 'requires_capture') {
        // Pagamento autorizado mas não capturado (escrow)
        toast.success('Seu pagamento foi autorizado e será retido até a conclusão do serviço.');
        onSuccess();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      onError('Erro inesperado no pagamento');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Informações do Cartão
          </span>
        </div>
        
        <div className="bg-white p-3 border rounded">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
        <Lock className="h-3 w-3" />
        <span>Pagamento seguro processado via Stripe</span>
      </div>

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          `Autorizar Pagamento - R$ ${(amount / 100).toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};
