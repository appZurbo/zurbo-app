
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, Clock, DollarSign, FileText, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EnhancedContractButtonProps {
  prestadorId: string;
  servicoNome: string;
  precoAcordado: number;
  descricao: string;
  onContractCreated?: (contractId: string) => void;
}

export const EnhancedContractButton: React.FC<EnhancedContractButtonProps> = ({
  prestadorId,
  servicoNome,
  precoAcordado,
  descricao,
  onContractCreated
}) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCreateContract = async () => {
    if (!profile) {
      toast.error('Você precisa estar logado para criar um contrato');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contratos')
        .insert([{
          cliente_id: profile.id,
          prestador_id: prestadorId,
          servico_nome: servicoNome,
          preco_acordado: precoAcordado,
          descricao: descricao,
          status: 'pendente'
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Contrato criado com sucesso!');
      onContractCreated?.(data.id);
      setShowDetails(false);
    } catch (error: any) {
      console.error('Erro ao criar contrato:', error);
      toast.error('Erro ao criar contrato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <FileText className="h-4 w-4 mr-2" />
          Criar Contrato
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Contrato de Serviço
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{servicoNome}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Valor Acordado:</span>
              <Badge className="bg-green-100 text-green-800">
                <DollarSign className="h-3 w-3 mr-1" />
                R$ {precoAcordado.toFixed(2)}
              </Badge>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-700">Descrição:</span>
              <p className="text-sm text-gray-600 mt-1">{descricao}</p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium">Termos do Contrato:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Pagamento após conclusão do serviço</li>
                    <li>• Garantia de 30 dias para o serviço</li>
                    <li>• Possibilidade de renegociação</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreateContract}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {loading ? 'Criando...' : 'Confirmar Contrato'}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
