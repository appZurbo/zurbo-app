
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertTriangle, Upload } from 'lucide-react';
import { useEscrowPayment } from '@/hooks/useEscrowPayment';
import { useToast } from '@/hooks/use-toast';

interface EscrowControlsProps {
  escrowPaymentId: string;
  status: string;
  amount: number;
  serviceName: string;
}

export const EscrowControls: React.FC<EscrowControlsProps> = ({
  escrowPaymentId,
  status,
  amount,
  serviceName
}) => {
  const [disputeReason, setDisputeReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { releasePayment } = useEscrowPayment();
  const { toast } = useToast();

  const handleConfirmCompletion = async () => {
    setLoading(true);
    try {
      await releasePayment(escrowPaymentId);
      toast({
        title: "Pagamento Liberado",
        description: "O pagamento foi liberado para o prestador.",
      });
    } catch (error) {
      console.error('Error releasing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, descreva o motivo da disputa.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Aqui seria chamada a função para criar disputa
      toast({
        title: "Disputa Criada",
        description: "Sua disputa foi registrada e será analisada em breve.",
      });
      setDisputeReason('');
    } catch (error) {
      console.error('Error creating dispute:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status !== 'authorized') {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Controle do Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>{serviceName}</strong> - R$ {amount.toFixed(2)}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Pagamento autorizado e retido em segurança
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleConfirmCompletion}
            disabled={loading}
            className="w-full"
            variant="default"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirmar Conclusão do Serviço
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Disputar Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Disputar Serviço</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dispute-reason">Motivo da Disputa</Label>
                  <Textarea
                    id="dispute-reason"
                    placeholder="Descreva detalhadamente o problema com o serviço..."
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Evidências (Opcional)</Label>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Fotos
                  </Button>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" disabled={loading}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleDispute}
                    disabled={loading || !disputeReason.trim()}
                  >
                    {loading ? 'Enviando...' : 'Criar Disputa'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Você tem 7 dias para confirmar ou disputar o serviço.
          Após esse período, o pagamento será liberado automaticamente.
        </div>
      </CardContent>
    </Card>
  );
};
