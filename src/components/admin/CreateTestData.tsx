import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createUnifiedTestData } from '@/utils/database/unified-test-data';
import { Loader2, Users, Database, MessageCircle, Calendar, Star } from 'lucide-react';
export const CreateTestData = () => {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const {
    toast
  } = useToast();
  const handleCreateTestData = async () => {
    setLoading(true);
    try {
      console.log('🚀 Starting test data creation...');
      const result = await createUnifiedTestData();
      if (result.success) {
        setLastResult(result.data);
        toast({
          title: "✅ Sucesso!",
          description: "Dados de teste criados com sucesso! Verifique as páginas /conversas e /prestadores."
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Criar Dados de Teste
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Clique no botão abaixo para gerar dados de teste para demonstração da plataforma.
          </p>
          <Button 
            onClick={handleCreateTestData}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando dados de teste...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Criar Dados de Teste
              </>
            )}
          </Button>
          
          {lastResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">✅ Dados criados com sucesso!</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {lastResult.users || 0} usuários
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {lastResult.conversations || 0} conversas
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {lastResult.appointments || 0} agendamentos
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  {lastResult.reviews || 0} avaliações
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};