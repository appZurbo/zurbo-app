import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, DollarSign } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  zurbo_fee?: number;
  status: string;
  created_at: string;
}

interface RevenueChartProps {
  data: Transaction[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const [period, setPeriod] = useState('month');
  const [chartType, setChartType] = useState('line');

  const processDataForChart = () => {
    const completedTransactions = data.filter(t => t.status === 'captured');
    const now = new Date();
    let chartData: { date: string; value: number; transactions: number }[] = [];

    if (period === 'month') {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(now, i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        
        const monthTransactions = completedTransactions.filter(t => {
          const transactionDate = new Date(t.created_at);
          return transactionDate >= monthStart && transactionDate <= monthEnd;
        });

        const revenue = monthTransactions.reduce((sum, t) => sum + (t.amount - (t.zurbo_fee || 0)), 0);

        chartData.push({
          date: format(monthDate, 'MMM/yy', { locale: ptBR }),
          value: revenue,
          transactions: monthTransactions.length
        });
      }
    } else {
      // Last 8 weeks
      for (let i = 7; i >= 0; i--) {
        const weekDate = subWeeks(now, i);
        const weekStart = startOfWeek(weekDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(weekDate, { weekStartsOn: 0 });
        
        const weekTransactions = completedTransactions.filter(t => {
          const transactionDate = new Date(t.created_at);
          return transactionDate >= weekStart && transactionDate <= weekEnd;
        });

        const revenue = weekTransactions.reduce((sum, t) => sum + (t.amount - (t.zurbo_fee || 0)), 0);

        chartData.push({
          date: format(weekStart, 'dd/MM', { locale: ptBR }),
          value: revenue,
          transactions: weekTransactions.length
        });
      }
    }

    return chartData;
  };

  const chartData = processDataForChart();
  
  const totalRevenue = chartData.reduce((sum, item) => sum + item.value, 0);
  const totalTransactions = chartData.reduce((sum, item) => sum + item.transactions, 0);
  const averageRevenue = chartData.length > 0 ? totalRevenue / chartData.length : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-green-600">
            Receita: R$ {payload[0].value.toFixed(2)}
          </p>
          <p className="text-blue-600 text-sm">
            {payload[0].payload.transactions} transação(ões)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Gráfico de Receita
          </CardTitle>
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Mensal</SelectItem>
                <SelectItem value="week">Semanal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Linha</SelectItem>
                <SelectItem value="bar">Barras</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-green-700">Total no Período</p>
              <p className="text-lg font-semibold text-green-800">
                R$ {totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {totalTransactions}
            </div>
            <div>
              <p className="text-sm text-blue-700">Total de Transações</p>
              <p className="text-lg font-semibold text-blue-800">
                {totalTransactions} serviços
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              Ø
            </div>
            <div>
              <p className="text-sm text-purple-700">Média por Período</p>
              <p className="text-lg font-semibold text-purple-800">
                R$ {averageRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {chartData.length === 0 && (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhum dado disponível para o período selecionado</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};