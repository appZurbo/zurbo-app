
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createFakePrestadores } from '@/utils/database/fake-prestadores';
import { createFakeUsers } from '@/utils/database/fake-data';
import { Loader2, UserPlus, Users } from 'lucide-react';

export const EnhancedFakeDataGenerator = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateEnhancedProviders = async () => {
    setLoading(true);
    try {
      const success = await createFakePrestadores();
      
      if (success) {
        toast({
          title: "Prestadores Criados",
          description: "Prestadores para todas as categorias foram criados com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Houve um erro ao criar os prestadores.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating providers:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLegacyUsers = async () => {
    setLoading(true);
    try {
      const success = await createFakeUsers();
      
      if (success) {
        toast({
          title: "Usuários Legados Criados",
          description: "Usuários de teste básicos criados com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao criar usuários legados.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating legacy users:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-500" />
          Gerador de Dados de Teste
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500 mb-4">
          Use estas ferramentas para popular o banco de dados com usuários fictícios para testes visuais e de funcionalidade.
        </p>
        
        <Button 
          onClick={handleGenerateEnhancedProviders} 
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Gerar Prestadores (Todas Categorias)
            </>
          )}
        </Button>

        <Button 
          onClick={handleGenerateLegacyUsers} 
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Users className="mr-2 h-4 w-4" />
              Gerar Usuários Básicos (Legado)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
