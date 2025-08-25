import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  RefreshCw,
  Settings,
  Info
} from 'lucide-react';
import { useStripeConnect } from '@/hooks/useStripeConnect';

interface StripeAccount {
  id: string;
  stripe_account_id: string;
  charges_enabled: boolean;
  details_submitted: boolean;
  account_type: string;
  created_at: string;
}

interface StripeAccountStatusProps {
  account: StripeAccount | null;
  onRefresh: () => void;
}

export const StripeAccountStatus = ({ account, onRefresh }: StripeAccountStatusProps) => {
  const { createStripeAccount, getAccountLink, loading } = useStripeConnect();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const handleCreateAccount = async () => {
    const result = await createStripeAccount();
    if (result) {
      await onRefresh();
    }
  };

  const handleOpenAccountLink = async () => {
    if (account?.stripe_account_id) {
      const url = await getAccountLink(account.stripe_account_id);
      if (url) {
        window.open(url, '_blank');
      }
    }
  };

  const getAccountStatus = () => {
    if (!account) return { status: 'not_created', color: 'gray', text: 'Conta não criada' };
    
    if (account.charges_enabled && account.details_submitted) {
      return { status: 'active', color: 'green', text: 'Ativa e verificada' };
    } else if (account.details_submitted) {
      return { status: 'under_review', color: 'orange', text: 'Em análise' };
    } else {
      return { status: 'incomplete', color: 'red', text: 'Incompleta' };
    }
  };

  const status = getAccountStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Status da Conta Stripe
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!account ? (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Você precisa de uma conta Stripe Connect para receber pagamentos. 
                Isso permite que transferências sejam feitas diretamente para sua conta bancária.
              </AlertDescription>
            </Alert>
            
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Conta Stripe não encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Crie sua conta Stripe Connect para começar a receber pagamentos
              </p>
              <Button onClick={handleCreateAccount} disabled={loading}>
                <CreditCard className="h-4 w-4 mr-2" />
                {loading ? 'Criando...' : 'Criar Conta Stripe'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Account Status Overview */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  status.color === 'green' ? 'bg-green-100' :
                  status.color === 'orange' ? 'bg-orange-100' :
                  status.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {status.status === 'active' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">Status da Conta</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {account.stripe_account_id.slice(0, 12)}...
                  </p>
                </div>
              </div>
              <Badge className={
                status.color === 'green' ? 'bg-green-100 text-green-800' :
                status.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }>
                {status.text}
              </Badge>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Recebimento de pagamentos</span>
                <div className="flex items-center gap-2">
                  {account.charges_enabled ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    account.charges_enabled ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {account.charges_enabled ? 'Habilitado' : 'Desabilitado'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Detalhes enviados</span>
                <div className="flex items-center gap-2">
                  {account.details_submitted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    account.details_submitted ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {account.details_submitted ? 'Completo' : 'Pendente'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleOpenAccountLink}
                disabled={loading}
                className="flex-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar Conta
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver no Stripe
              </Button>
            </div>

            {/* Status Alerts */}
            {!account.details_submitted && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Você precisa completar as informações da sua conta Stripe para receber pagamentos.
                  Clique em "Gerenciar Conta" para continuar o processo.
                </AlertDescription>
              </Alert>
            )}

            {account.details_submitted && !account.charges_enabled && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Sua conta está em análise pela Stripe. Isso pode levar alguns dias úteis.
                  Você será notificado quando a análise for concluída.
                </AlertDescription>
              </Alert>
            )}

            {account.charges_enabled && account.details_submitted && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Sua conta está totalmente configurada e você pode receber pagamentos!
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};