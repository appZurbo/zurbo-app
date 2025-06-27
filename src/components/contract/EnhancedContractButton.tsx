
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Phone, CheckCircle } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface EnhancedContractButtonProps {
  prestador: UserProfile;
  className?: string;
}

export const EnhancedContractButton = ({ prestador, className }: EnhancedContractButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const { profile } = useAuth();
  const { createConversation } = useEnhancedChat();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Safely get prestador services with proper null checks
  const prestadorServices = Array.isArray(prestador?.servicos_oferecidos) 
    ? prestador.servicos_oferecidos 
    : [];

  const handleContractService = async () => {
    if (!profile) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para contratar serviços.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedService) {
      toast({
        title: "Selecione um serviço",
        description: "Por favor, selecione o serviço que deseja contratar.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create conversation
      const conversation = await createConversation(prestador.id, selectedService);
      
      if (conversation) {
        setShowConfirm(false);
        toast({
          title: "Conversa iniciada",
          description: "Sua conversa com o prestador foi criada. Redirecionando...",
        });
        
        // Navigate to conversations page
        setTimeout(() => {
          navigate('/conversas');
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a conversa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (!prestador) {
    console.warn('EnhancedContractButton: prestador is undefined');
    return null;
  }

  return (
    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
      <DialogTrigger asChild>
        <Button className={`gradient-bg ${className || ''}`}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Contratar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-orange-500" />
            Contratar Serviço
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Prestador Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={prestador.foto_url || ''} alt={prestador.nome || ''} />
                  <AvatarFallback>
                    {(prestador.nome || '?').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{prestador.nome || 'Nome não informado'}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {prestador.nota_media && prestador.nota_media > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{prestador.nota_media.toFixed(1)}</span>
                      </div>
                    )}
                    
                    {prestador.endereco_cidade && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{prestador.endereco_cidade}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {prestador.premium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600">
                    Premium
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Service Selection */}
          <div>
            <h4 className="font-medium mb-3">Selecione o serviço:</h4>
            
            {prestadorServices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 mb-4">
                  Nenhum serviço específico cadastrado
                </p>
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedService === 'Serviço Geral' ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedService('Serviço Geral')}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Serviço Geral</span>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedService === 'Serviço Geral' 
                          ? 'bg-orange-500 border-orange-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedService === 'Serviço Geral' && (
                          <CheckCircle className="h-4 w-4 text-white -m-0.5" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-2">
                {prestadorServices.map((servico, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedService === servico ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedService(servico)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{servico}</span>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedService === servico 
                            ? 'bg-orange-500 border-orange-500' 
                            : 'border-gray-300'
                        }`}>
                          {selectedService === servico && (
                            <CheckCircle className="h-4 w-4 text-white -m-0.5" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-800 mb-2">Como funciona:</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Uma conversa será iniciada com o prestador</li>
              <li>• Você poderá negociar preços e detalhes</li>
              <li>• O prestador confirmará a disponibilidade</li>
              <li>• Após acordo, o pedido será criado automaticamente</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleContractService}
              disabled={!selectedService}
              className="flex-1 gradient-bg"
            >
              <Phone className="h-4 w-4 mr-2" />
              Iniciar Conversa
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
