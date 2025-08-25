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
  return;
};