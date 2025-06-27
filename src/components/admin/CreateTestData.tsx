
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createUnifiedTestData } from '@/utils/database/unified-test-data';
import { Loader2, Users, Database, MessageCircle, Calendar, Star } from 'lucide-react';

export const CreateTestData = () => {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const { toast } = useToast();

  const handleCreateTestData = async () => {
    setLoading(true);
    try {
      console.log('🚀 Starting test data creation...');
      const result = await createUnifiedTestData();
      
      if (result.success) {
        setLastResult(result.data);
        toast({
          title: "✅ Sucesso!",
          description: "Dados de teste criados com sucesso! Verifique as páginas /conversas e /prestadores.",
        });
      } else {
        toast({
          title: "❌ Erro",
          description: result.error || "Houve um problema ao criar os dados de teste.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating test data:', error);
      toast({
        title: "❌ Erro",
        description: "Houve um problema ao criar os dados de teste.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sistema Completo de Teste
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-2">Esta função criará um sistema completo de teste incluindo:</p>
            <ul className="space-y-1 text-xs">
              <li className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                5 prestadores + 3 clientes
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-3 w-3" />
                12+ conversas com mensagens reais
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Pedidos e agendamentos
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-3 w-3" />
                Avaliações e histórico
              </li>
            </ul>
          </div>

          <Button 
            onClick={handleCreateTestData}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando Sistema...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Criar Sistema Completo
              </>
            )}
          </Button>

          {lastResult && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-semibold text-green-800 mb-2">✅ Última Execução:</h4>
              <div className="text-xs text-green-700 space-y-1">
                <div>👥 {lastResult.users} usuários</div>
                <div>💬 {lastResult.conversations} conversas</div>  
                <div>📝 {lastResult.messages} mensagens</div>
                <div>📦 {lastResult.pedidos} pedidos</div>
                <div>📅 {lastResult.agendamentos} agendamentos</div>
                <div>⭐ {lastResult.avaliacoes} avaliações</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
