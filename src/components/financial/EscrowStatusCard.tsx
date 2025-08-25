import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EscrowPayment {
  id: string;
  amount: number;
  zurbo_fee: number;
  status: string;
  created_at: string;
  auto_release_date?: string;
  conversation_id?: string;
}

interface EscrowStatusCardProps {
  payment: EscrowPayment;
}

export const EscrowStatusCard = ({ payment }: EscrowStatusCardProps) => {
  const getStatusIcon = () => {
    switch (payment.status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'authorized':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'disputed':
        return <AlertTriangle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'authorized':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disputed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'failed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (payment.status) {
      case 'pending':
        return 'Aguardando Pagamento';
      case 'authorized':
        return 'Em Escrow';
      case 'disputed':
        return 'Em Disputa';
      case 'failed':
        return 'Falhou';
      default:
        return 'Desconhecido';
    }
  };

  const netAmount = payment.amount - (payment.zurbo_fee || 0);
  const autoReleaseDate = payment.auto_release_date ? new Date(payment.auto_release_date) : null;
  const daysUntilRelease = autoReleaseDate ? 
    Math.ceil((autoReleaseDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              payment.status === 'authorized' ? 'bg-green-100' :
              payment.status === 'pending' ? 'bg-orange-100' :
              payment.status === 'disputed' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              {getStatusIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">R$ {netAmount.toFixed(2)}</p>
                <Badge className={getStatusColor()}>
                  {getStatusText()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Criado em {format(new Date(payment.created_at), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
              {payment.zurbo_fee && (
                <p className="text-xs text-muted-foreground">
                  Taxa Zurbo: R$ {payment.zurbo_fee.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            {payment.status === 'authorized' && autoReleaseDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {daysUntilRelease && daysUntilRelease > 0 
                    ? `${daysUntilRelease} dias para liberação automática`
                    : 'Liberação automática hoje'
                  }
                </span>
              </div>
            )}
            
            {payment.status === 'authorized' && (
              <Button size="sm" variant="outline">
                Ver Conversa
              </Button>
            )}
          </div>
        </div>

        {payment.status === 'authorized' && autoReleaseDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                Este pagamento será liberado automaticamente em {' '}
                {format(autoReleaseDate, 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
          </div>
        )}

        {payment.status === 'disputed' && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 text-sm text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span>
                Este pagamento está em disputa. Nossa equipe está analisando o caso.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};