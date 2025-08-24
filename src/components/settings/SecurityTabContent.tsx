
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useMobile } from '@/hooks/useMobile';

export const SecurityTabContent = () => {
  const { profile } = useAuth();
  const isMobile = useMobile();
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso."
      });

      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Erro ao excluir conta",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`${isMobile ? 'shadow-sm' : ''}`}>
      <CardHeader>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>
          Segurança da Conta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">Alterar Senha</h4>
          <p className="text-sm text-gray-600 mb-4">
            Para alterar sua senha, clique no botão abaixo. Você receberá um email com instruções.
          </p>
          <Button variant="outline" className={`${isMobile ? 'w-full' : ''}`}>
            Solicitar Alteração de Senha
          </Button>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-4 text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Zona de Perigo
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            As ações abaixo são irreversíveis. Tenha cuidado ao prosseguir.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount} 
            disabled={loading} 
            className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}
          >
            <Trash2 className="h-4 w-4" />
            {loading ? 'Excluindo...' : 'Excluir Conta'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
