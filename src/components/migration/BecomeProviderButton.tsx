
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const BecomeProviderButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { profile, logout } = useAuth();

  const handleMigration = async () => {
    if (!profile || profile.tipo !== 'cliente') {
      toast({
        title: "Erro",
        description: "Apenas clientes podem migrar para prestador.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call the migration function with proper parameter types
      const { error } = await supabase.rpc('migrate_client_to_provider', {
        user_uuid: profile.id
      });

      if (error) {
        console.error('Migration error:', error);
        toast({
          title: "Erro na migração",
          description: "Não foi possível migrar sua conta. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Migração realizada com sucesso!",
        description: "Você agora é um prestador. Faça login novamente para acessar suas novas funcionalidades.",
      });

      // Auto logout to refresh the session
      setTimeout(async () => {
        await logout();
        window.location.href = '/auth';
      }, 2000);

      setIsOpen(false);
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante a migração. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only show for clients
  if (!profile || profile.tipo !== 'cliente') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200"
        >
          <Users className="h-5 w-5 mr-2" />
          Quero me tornar um prestador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <Users className="h-5 w-5" />
            Migrar para Prestador
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Transforme sua conta em prestador de serviços
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Dados preservados:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Nome completo e CPF</li>
              <li>• Histórico de mensagens</li>
              <li>• Avaliações recebidas e dadas</li>
              <li>• Dados de pagamento</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Novas funcionalidades:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Configurar tipos de serviços oferecidos</li>
              <li>• Definir área de atendimento</li>
              <li>• Receber e responder solicitações</li>
              <li>• Gerenciar portfólio de trabalhos</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            Após a migração, você precisará fazer login novamente para acessar as novas funcionalidades de prestador.
          </p>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={handleMigration}
              disabled={isLoading}
            >
              {isLoading ? 'Migrando...' : 'Confirmar Migração'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
