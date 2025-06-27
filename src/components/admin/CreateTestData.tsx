
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createAllFakeData } from '@/utils/database/fake-data';
import { Loader2, Users } from 'lucide-react';

export const CreateTestData = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateTestData = async () => {
    setLoading(true);
    try {
      const success = await createAllFakeData();
      
      if (success) {
        toast({
          title: "Sucesso!",
          description: "Dados de teste criados com sucesso. Recarregue a página para ver os novos prestadores.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Houve um problema ao criar os dados de teste.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating test data:', error);
      toast({
        title: "Erro",
        description: "Houve um problema ao criar os dados de teste.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Dados de Teste
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Criar 10 prestadores de teste com dados completos, avaliações, histórico e conversas.
        </p>
        <Button 
          onClick={handleCreateTestData}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Criando...
            </>
          ) : (
            'Criar Prestadores de Teste'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
