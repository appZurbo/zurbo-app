import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Phone, Crown } from 'lucide-react';
import { useSOSLimits } from '@/hooks/useSOSLimits';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const EnhancedEmergencyButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { sosUsage, loading, canUseSOS, useSOS } = useSOSLimits();
  const { profile } = useAuth();
  const { toast } = useToast();

  const handleEmergencyCall = async () => {
    if (!canUseSOS()) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite mensal de chamadas SOS.",
        variant: "destructive"
      });
      return;
    }

    const success = await useSOS();
    if (success) {
      setShowConfirm(false);
      
      // Simulate emergency call
      toast({
        title: "SOS Ativado",
        description: "Sua solicitação de emergência foi enviada!",
      });
      
      // Here you would integrate with actual emergency services
      console.log('Emergency SOS activated for user:', profile?.id);
    }
  };

  if (!profile) return null;

  return (
    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
      <DialogTrigger asChild>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          size="lg"
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          SOS EMERGÊNCIA
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmação SOS
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium mb-2">
              ⚠️ Use apenas em situações de real emergência
            </p>
            <p className="text-xs text-red-600">
              O uso inadequado pode resultar em penalidades ou suspensão da conta.
            </p>
          </div>

          {/* Usage Information */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Limite Mensal:</span>
              <div className="flex items-center gap-2">
                {profile.premium && <Crown className="h-4 w-4 text-yellow-500" />}
                <Badge variant={profile.premium ? "default" : "secondary"}>
                  {profile.premium ? 'Premium' : 'Normal'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Usadas este mês:</span>
                <span className="font-medium">{sosUsage.current}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Limite total:</span>
                <span className="font-medium">{sosUsage.limit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Restantes:</span>
                <span className={`font-medium ${sosUsage.remaining === 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {sosUsage.remaining}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    sosUsage.current >= sosUsage.limit ? 'bg-red-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min((sosUsage.current / sosUsage.limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {!profile.premium && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-700">
                💡 <strong>Usuários Premium</strong> têm mais chamadas SOS por mês (7 vs 3)
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleEmergencyCall}
              disabled={!canUseSOS() || loading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Phone className="h-4 w-4 mr-2" />
              {loading ? 'Processando...' : 'Confirmar SOS'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
