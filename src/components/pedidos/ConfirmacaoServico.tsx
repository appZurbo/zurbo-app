
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Pedido, UserProfile } from '@/utils/database/types';

interface ConfirmacaoServicoProps {
  pedido: Pedido;
  user: UserProfile;
  onUpdate?: () => void;
}

export const ConfirmacaoServico: React.FC<ConfirmacaoServicoProps> = ({
  pedido,
  user,
  onUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isCliente = user.id === pedido.cliente_id;
  const isPrestador = user.id === pedido.prestador_id;
  
  if (!isCliente && !isPrestador) return null;

  const jaConfirmou = isCliente ? pedido.cliente_confirmou : pedido.prestador_confirmou;
  const outroConfirmou = isCliente ? pedido.prestador_confirmou : pedido.cliente_confirmou;
  const ambosConfirmaram = pedido.cliente_confirmou && pedido.prestador_confirmou;

  const handleConfirmar = async () => {
    setLoading(true);
    
    try {
      const campo = isCliente ? 'cliente_confirmou' : 'prestador_confirmou';
      
      // Update confirmation status
      const { error: updateError } = await supabase
        .from('pedidos')
        .update({ [campo]: true })
        .eq('id', pedido.id);

      if (updateError) throw updateError;

      // Check if both confirmed to trigger payment release
      const { data: atualizado, error: fetchError } = await supabase
        .from('pedidos')
        .select('cliente_confirmou, prestador_confirmou, status_pagamento')
        .eq('id', pedido.id)
        .single();

      if (fetchError) throw fetchError;

      if (atualizado?.cliente_confirmou && atualizado?.prestador_confirmou && 
          atualizado?.status_pagamento === 'pago_em_escrow') {
        
        // Find the escrow payment for this pedido
        const { data: escrowPayment } = await supabase
          .from('escrow_payments')
          .select('id')
          .eq('pedido_id', pedido.id)
          .eq('status', 'authorized')
          .single();

        if (escrowPayment) {
          // Trigger payment release
          const { error: releaseError } = await supabase.functions.invoke('capture-escrow-payment', {
            body: { escrowPaymentId: escrowPayment.id }
          });

          if (releaseError) {
            console.error('Error releasing payment:', releaseError);
          } else {
            toast({
              title: "Pagamento Liberado",
              description: "O pagamento foi liberado com sucesso para o prestador!",
            });
          }
        }
      }

      toast({
        title: "Confirmação Enviada",
        description: "Sua confirmação foi registrada com sucesso!",
      });

      onUpdate?.();
    } catch (error) {
      console.error('Error confirming service:', error);
      toast({
        title: "Erro",
        description: "Não foi possível confirmar o serviço. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (pedido.status_pagamento !== 'pago_em_escrow') {
    return null;
  }

  return (
    <Card className="mt-4 border-green-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Pagamento Confirmado
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              {pedido.cliente_confirmou ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
              <span className={pedido.cliente_confirmou ? 'text-green-700' : 'text-yellow-700'}>
                Cliente {pedido.cliente_confirmou ? 'confirmou' : 'aguardando'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {pedido.prestador_confirmou ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
              <span className={pedido.prestador_confirmou ? 'text-green-700' : 'text-yellow-700'}>
                Prestador {pedido.prestador_confirmou ? 'confirmou' : 'aguardando'}
              </span>
            </div>
          </div>

          {ambosConfirmaram ? (
            <Badge variant="default" className="w-full justify-center bg-green-100 text-green-800">
              ✅ Serviço Confirmado - Pagamento Liberado
            </Badge>
          ) : jaConfirmou ? (
            <Badge variant="secondary" className="w-full justify-center">
              ✅ Sua confirmação foi enviada
            </Badge>
          ) : (
            <Button 
              onClick={handleConfirmar}
              disabled={loading}
              className="w-full"
              variant="default"
            >
              {loading ? 'Confirmando...' : 'Confirmar Conclusão do Serviço'}
            </Button>
          )}

          {jaConfirmou && !outroConfirmou && (
            <p className="text-xs text-gray-600 text-center">
              Aguardando confirmação da outra parte para liberar o pagamento
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
