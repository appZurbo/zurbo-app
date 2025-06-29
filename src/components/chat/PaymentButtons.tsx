
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Check, X, CreditCard } from 'lucide-react';
import { ChatConversation } from '@/hooks/useEnhancedChat';
import { useEscrowPayment } from '@/hooks/useEscrowPayment';

interface PaymentButtonsProps {
  conversation: ChatConversation;
  currentUserId: string;
  canSetPrice: boolean;
  onSetPrice: (price: number) => void;
  onRespondToPrice: (accept: boolean) => void;
}

export const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  conversation,
  currentUserId,
  canSetPrice,
  onSetPrice,
  onRespondToPrice
}) => {
  const [priceInput, setPriceInput] = useState('');
  const [showPriceInput, setShowPriceInput] = useState(false);
  const { createEscrowPayment, loading } = useEscrowPayment();

  const isClient = conversation.cliente_id === currentUserId;
  const isProvider = conversation.prestador_id === currentUserId;

  const handleSetPrice = () => {
    const price = parseFloat(priceInput);
    if (price > 0) {
      onSetPrice(price);
      setShowPriceInput(false);
      setPriceInput('');
    }
  };

  const handlePayment = async () => {
    if (conversation.preco_proposto) {
      const result = await createEscrowPayment(
        conversation.id,
        conversation.preco_proposto,
        'BRL'
      );
      
      if (result?.checkout_url) {
        window.location.href = result.checkout_url;
      }
    }
  };

  // Botão para definir preço (apenas cliente)
  if (isClient && conversation.status === 'aguardando_preco' && canSetPrice) {
    if (showPriceInput) {
      return (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Definir Preço do Serviço</h4>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="pl-8"
                    min="0"
                    step="0.01"
                  />
                </div>
                <Button onClick={handleSetPrice} disabled={!priceInput}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setShowPriceInput(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <Button 
            onClick={() => setShowPriceInput(true)} 
            className="w-full"
            variant="outline"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Definir Preço
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Botões para aceitar/rejeitar preço (apenas prestador)
  if (isProvider && conversation.status === 'preco_definido') {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="space-y-3">
            <h4 className="font-semibold">
              Preço proposto: R$ {conversation.preco_proposto?.toFixed(2)}
            </h4>
            <div className="flex gap-2">
              <Button 
                onClick={() => onRespondToPrice(true)} 
                className="flex-1"
                variant="default"
              >
                <Check className="h-4 w-4 mr-2" />
                Aceitar
              </Button>
              <Button 
                onClick={() => onRespondToPrice(false)} 
                className="flex-1"
                variant="outline"
              >
                <X className="h-4 w-4 mr-2" />
                Rejeitar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Botão para pagar (apenas cliente após prestador aceitar)
  if (isClient && conversation.status === 'aceito' && conversation.preco_proposto) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="space-y-3">
            <h4 className="font-semibold">
              Serviço Aceito - R$ {conversation.preco_proposto.toFixed(2)}
            </h4>
            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {loading ? 'Processando...' : 'Pagar Agora'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Status do pagamento/serviço
  if (['pagamento_retido', 'em_andamento', 'concluido'].includes(conversation.status)) {
    const statusText = {
      'pagamento_retido': 'Pagamento retido - Aguardando início do serviço',
      'em_andamento': 'Serviço em andamento',
      'concluido': 'Serviço concluído'
    };

    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="font-semibold text-green-600">
              {statusText[conversation.status as keyof typeof statusText]}
            </p>
            {conversation.preco_proposto && (
              <p className="text-sm text-gray-600 mt-1">
                Valor: R$ {conversation.preco_proposto.toFixed(2)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
