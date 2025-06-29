
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Loader2 } from 'lucide-react';
import { useStripeIntegration } from '@/hooks/useStripeIntegration';

interface StripeCheckoutButtonProps {
  priceId: string;
  planName: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export const StripeCheckoutButton: React.FC<StripeCheckoutButtonProps> = ({
  priceId,
  planName,
  price,
  features,
  isPopular = false
}) => {
  const { createCheckoutSession, loading } = useStripeIntegration();

  const handleCheckout = async () => {
    await createCheckoutSession(priceId);
  };

  return (
    <div className={`relative p-6 border rounded-lg ${isPopular ? 'border-orange-500 shadow-lg' : 'border-gray-200'}`}>
      {isPopular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
          Mais Popular
        </Badge>
      )}
      
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">{planName}</h3>
        <div className="text-3xl font-bold text-orange-600 mb-4">
          {price}
          <span className="text-sm text-gray-500 font-normal">/mês</span>
        </div>
        
        <ul className="text-sm text-gray-600 mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Crown className="h-4 w-4 text-orange-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={handleCheckout}
          disabled={loading}
          className="w-full"
          variant={isPopular ? "default" : "outline"}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Assinar Agora'
          )}
        </Button>
      </div>
    </div>
  );
};
