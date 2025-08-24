
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const BecomeProviderButton = () => {
  const { profile, isPrestador } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleBecomeProvider = async () => {
    if (!profile || isPrestador) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ tipo: 'prestador' })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success('Parabéns! Você agora é um prestador de serviços!');
      
      // Refresh the page to update the auth context
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Erro ao tornar-se prestador:', error);
      toast.error('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  if (!profile || isPrestador) {
    return null;
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
          <Wrench className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">Torne-se um Prestador</h3>
          <p className="text-sm text-gray-600">
            Ofereça seus serviços e ganhe dinheiro na nossa plataforma
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Crown className="h-4 w-4 text-yellow-500" />
            <span>Receba pagamentos</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Crown className="h-4 w-4 text-yellow-500" />
            <span>Gerencie sua agenda</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Crown className="h-4 w-4 text-yellow-500" />
            <span>Avaliações de clientes</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Crown className="h-4 w-4 text-yellow-500" />
            <span>Perfil profissional</span>
          </div>
        </div>

        <Button
          onClick={handleBecomeProvider}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
        >
          <Wrench className="h-4 w-4 mr-2" />
          {loading ? 'Processando...' : 'Tornar-se Prestador'}
        </Button>
      </div>
    </div>
  );
};
