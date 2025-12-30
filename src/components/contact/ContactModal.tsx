
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ContactModalProps {
  prestador: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  prestador,
  open,
  onOpenChange
}) => {
  const [servico, setServico] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const { profile, isAuthenticated } = useAuth();
  const { createConversation, sendMessage } = useEnhancedChat();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !profile) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para enviar mensagens.",
        variant: "destructive"
      });
      return;
    }

    if (!servico.trim() || !mensagem.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o tipo de serviço e a mensagem.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Criar ou encontrar conversa existente
      const conversation = await createConversation(prestador.id, servico.trim());
      
      if (!conversation) {
        throw new Error('Não foi possível criar a conversa');
      }

      // Enviar mensagem inicial
      await sendMessage(conversation.id, mensagem.trim());

      toast({
        title: "Mensagem enviada!",
        description: "Sua mensagem foi enviada com sucesso.",
      });

      // Limpar formulário e fechar modal
      setServico('');
      setMensagem('');
      onOpenChange(false);

      // Redirecionar para a página de conversas
      navigate('/conversas');

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Debug log
  useEffect(() => {
    console.log('📞 ContactModal render:', { open, prestador: prestador?.nome });
  }, [open, prestador]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md z-[100]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5" />
            Contatar Prestador
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Avatar className="h-12 w-12">
            <AvatarImage src={prestador.foto_url} />
            <AvatarFallback>
              {prestador.nome?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{prestador.nome}</h3>
            <p className="text-sm text-gray-600">{prestador.endereco_cidade}</p>
            {prestador.nota_media && (
              <p className="text-sm text-yellow-600">
                ⭐ {prestador.nota_media.toFixed(1)}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="servico">Tipo de Serviço *</Label>
            <Input
              id="servico"
              value={servico}
              onChange={(e) => setServico(e.target.value)}
              placeholder="Ex: Limpeza, Encanamento, Elétrica..."
              required
            />
          </div>

          <div>
            <Label htmlFor="mensagem">Mensagem *</Label>
            <Textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Descreva o serviço que você precisa..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !servico.trim() || !mensagem.trim()}
              className="flex-1"
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </div>
        </form>

        {!isAuthenticated && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              ⚠️ Você precisa estar logado para enviar mensagens.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
