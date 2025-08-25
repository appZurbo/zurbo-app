import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Download,
  ExternalLink,
  Banknote,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEscrowPayment } from '@/hooks/useEscrowPayment';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { supabase } from '@/integrations/supabase/client';
import { EscrowStatusCard } from './EscrowStatusCard';
import { TransactionHistory } from './TransactionHistory';
import { RevenueChart } from './RevenueChart';
import { StripeAccountStatus } from './StripeAccountStatus';

interface FinancialData {
  totalReceived: number;
  totalInEscrow: number;
  totalPending: number;
  monthlyRevenue: number;
  escrowPayments: any[];
  transactions: any[];
}

export const FinancialSection = () => {
  const { profile } = useAuth();
  const { getEscrowPayments } = useEscrowPayment();
  const { getStripeAccount } = useStripeConnect();
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalReceived: 0,
    totalInEscrow: 0,
    totalPending: 0,
    monthlyRevenue: 0,
    escrowPayments: [],
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const [stripeAccount, setStripeAccount] = useState<any>(null);

  useEffect(() => {
    loadFinancialData();
    loadStripeAccount();
  }, [profile]);

  const loadFinancialData = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      // Load escrow payments for conversations where this user is the provider
      const { data: conversations } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('prestador_id', profile.id);

      if (!conversations) return;

      const conversationIds = conversations.map(c => c.id);
      let allEscrowPayments: any[] = [];

      // Get escrow payments for all conversations
      for (const conversationId of conversationIds) {
        const payments = await getEscrowPayments(conversationId);
        allEscrowPayments = [...allEscrowPayments, ...payments];
      }

      // Calculate totals
      const totalReceived = allEscrowPayments
        .filter(p => p.status === 'captured')
        .reduce((sum, p) => sum + (p.amount - (p.zurbo_fee || 0)), 0);

      const totalInEscrow = allEscrowPayments
        .filter(p => p.status === 'authorized')
        .reduce((sum, p) => sum + (p.amount - (p.zurbo_fee || 0)), 0);

      const totalPending = allEscrowPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + (p.amount - (p.zurbo_fee || 0)), 0);

      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = allEscrowPayments
        .filter(p => {
          const paymentDate = new Date(p.created_at);
          return paymentDate.getMonth() === currentMonth && 
                 paymentDate.getFullYear() === currentYear &&
                 p.status === 'captured';
        })
        .reduce((sum, p) => sum + (p.amount - (p.zurbo_fee || 0)), 0);

      setFinancialData({
        totalReceived,
        totalInEscrow,
        totalPending,
        monthlyRevenue,
        escrowPayments: allEscrowPayments,
        transactions: allEscrowPayments // For now, using escrow payments as transactions
      });

    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStripeAccount = async () => {
    try {
      const account = await getStripeAccount();
      setStripeAccount(account);
    } catch (error) {
      console.error('Error loading Stripe account:', error);
    }
  };

  const exportFinancialReport = () => {
    // Create CSV content
    const csvContent = [
      ['Data', 'Tipo', 'Valor', 'Status', 'Taxa Zurbo'],
      ...financialData.escrowPayments.map(payment => [
        new Date(payment.created_at).toLocaleDateString('pt-BR'),
        'Pagamento Escrow',
        `R$ ${payment.amount.toFixed(2)}`,
        payment.status,
        `R$ ${(payment.zurbo_fee || 0).toFixed(2)}`
      ])
    ].map(row => row.join(',')).join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-financeiro-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Recebido</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {financialData.totalReceived.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Escrow</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {financialData.totalInEscrow.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aguardando</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {financialData.totalPending.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold text-purple-600">
                  R$ {financialData.monthlyRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button onClick={exportFinancialReport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
        {stripeAccount && (
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver no Stripe
          </Button>
        )}
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="escrow">Pagamentos Escrow</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="account">Conta Stripe</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <RevenueChart data={financialData.escrowPayments} />
        </TabsContent>

        <TabsContent value="escrow">
          <div className="space-y-4">
            {financialData.escrowPayments
              .filter(p => p.status !== 'captured')
              .map(payment => (
                <EscrowStatusCard key={payment.id} payment={payment} />
              ))
            }
            {financialData.escrowPayments.filter(p => p.status !== 'captured').length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Banknote className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Nenhum pagamento em escrow no momento</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <TransactionHistory transactions={financialData.transactions} />
        </TabsContent>

        <TabsContent value="account">
          <StripeAccountStatus account={stripeAccount} onRefresh={loadStripeAccount} />
        </TabsContent>
      </Tabs>
    </div>
  );
};