
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Phone, Mail } from 'lucide-react';
import { type UserProfile } from '@/utils/database';
import { useToast } from '@/hooks/use-toast';

interface ContactModalProps {
  prestador: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContactModal = ({ prestador, open, onOpenChange }: ContactModalProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Mensagem vazia",
        description: "Por favor, escreva uma mensagem antes de enviar",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      // Simular envio de mensagem (implementar integração real futuramente)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mensagem enviada!",
        description: `Sua mensagem foi enviada para ${prestador.nome}`,
      });
      
      setMessage('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Entrar em contato
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do prestador */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={prestador.foto_url} />
                  <AvatarFallback>{prestador.nome?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{prestador.nome}</h3>
                    {prestador.premium && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{prestador.tipo}</p>
                  {prestador.endereco_cidade && (
                    <p className="text-sm text-gray-500">{prestador.endereco_cidade}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de mensagem */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Sua mensagem para {prestador.nome}:
            </label>
            <Textarea
              placeholder="Olá! Gostaria de saber mais sobre seus serviços..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Seja claro sobre o que você precisa e quando precisa do serviço.
            </p>
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSendMessage}
              disabled={sending}
              className="flex-1"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sending}
            >
              Cancelar
            </Button>
          </div>

          {/* Informações adicionais */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> Seja específico sobre o serviço que precisa, 
              localização e prazo desejado para receber respostas mais rápidas.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
