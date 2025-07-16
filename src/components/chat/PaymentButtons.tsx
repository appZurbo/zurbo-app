import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, CreditCard, X } from 'lucide-react';
import { PaymentCard } from '@/components/payments/PaymentCard';
import { ChatConversation } from '@/utils/database/types';

interface PaymentButtonsProps {
  conversation: ChatConversation;
  currentUserId: string;
  onSendMessage: (message: string, type?: string, metadata?: any) => Promise<void>;
  onUpdate?: () => void;
}

export const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  conversation,
  currentUserId,
  onSendMessage,
  onUpdate
}) => {
  const [priceInput, setPriceInput] = useState('');
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const isClient = conversation.cliente_id === currentUserId;
  const isProvider = conversation.prestador_id === currentUserId;

  const handlePriceSubmit = async () => {
    const price = parseFloat(priceInput);
    if (price > 0) {
      await onSendMessage(`💰 Proposta de preço: R$ ${price.toFixed(2)}`, 'price_proposal', { preco_proposto: price });
      setPriceInput('');
      setShowPriceInput(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    onUpdate?.();
  };

  // Campo para inserir preço (apenas cliente)
  if (isClient && conversation.status === 'aguardando_preco') {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          {showPriceInput ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Digite o preço"
                className="flex-1 p-2 border rounded"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
              />
              <Button size="sm" onClick={handlePriceSubmit}>
                Enviar
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => setShowPriceInput(true)}>
              Propor Preço
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Botão para aceitar preço (apenas prestador)
  if (isProvider && conversation.status === 'aguardando_preco' && conversation.preco_proposto) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">
              Cliente propôs: R$ {conversation.preco_proposto.toFixed(2)}
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onSendMessage('❌ Preço recusado. Vamos negociar?', 'price_declined')}
              >
                <X className="h-4 w-4 mr-1" />
                Recusar
              </Button>
              <Button 
                size="sm"
                onClick={() => onSendMessage('✅ Preço aceito! Aguardando pagamento.', 'price_accepted')}
              >
                <Check className="h-4 w-4 mr-1" />
                Aceitar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Botão para pagar (apenas cliente após prestador aceitar)
  if (isClient && conversation.status === 'aceito' && conversation.preco_proposto) {
    if (showPayment) {
      return (
        <div className="mt-4">
          <PaymentCard
            serviceName={conversation.servico_solicitado}
            providerName="Prestador"
            totalPrice={conversation.preco_proposto}
            conversationId={conversation.id}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      );
    }

    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-green-700">
              Serviço Aceito - R$ {conversation.preco_proposto.toFixed(2)}
            </h4>
            <Button 
              onClick={() => setShowPayment(true)}
              className="w-full"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pagar Agora
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
