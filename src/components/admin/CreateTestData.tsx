import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createUnifiedTestData } from '@/utils/database/unified-test-data';
import { createFakePrestadores } from '@/utils/database/fake-prestadores';
import { Loader2, Users, Database, MessageCircle, Calendar, Star, UserPlus, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const CreateTestData = () => {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    toast
  } = useToast();

  const handleCreateTestData = async () => {
    setLoading(true);
    setError(null);
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
        setError(result.error || "Erro ao criar dados.");
        toast({
          title: "❌ Erro",
          description: result.error || "Houve um problema ao criar os dados de teste.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error creating test data:', error);
      setError(error.message || "Erro desconhecido");
      toast({
        title: "❌ Erro",
        description: "Houve um problema ao criar os dados de teste.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrestadores = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🚀 Starting prestadores creation...');
      const success = await createFakePrestadores();
      
      if (success) {
        toast({
          title: "✅ Prestadores Criados!",
          description: "Prestadores para todas as categorias foram gerados com sucesso."
        });
      } else {
        const msg = "Falha ao criar prestadores. Verifique se você é Admin e se as políticas RLS permitem inserção.";
        setError(msg);
        toast({
          title: "❌ Erro de Permissão",
          description: "Provavelmente você precisa aplicar a migração de permissão de Admin.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error creating prestadores:', error);
      setError(error.message || "Erro desconhecido");
      toast({
        title: "❌ Erro",
        description: "Erro inesperado ao criar prestadores.",
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
          Gerenciar Dados de Teste
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Ferramentas para popular o banco de dados com usuários fictícios.
          </p>
          
          {error && (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                {error}
                <div className="mt-2 text-xs font-mono bg-black/10 p-2 rounded">
                  Dica: Verifique se você executou a migração 'allow_admin_user_creation.sql' no Supabase.
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-3">
            <Button 
              onClick={handleCreateTestData}
              disabled={loading}
              variant="outline"
              className="w-full justify-start"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Gerar Dados Completos (Usuários + Conversas)
            </Button>

            <Button 
              onClick={handleCreatePrestadores}
              disabled={loading}
              className="w-full justify-start bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Gerar Prestadores (Todas as Categorias)
            </Button>
          </div>
          
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
