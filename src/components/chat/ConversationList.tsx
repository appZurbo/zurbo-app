
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChatConversation } from '@/hooks/useEnhancedChat';

interface ConversationListProps {
  conversations: ChatConversation[];
  currentUserId: string;
  onConversationSelect: (conversation: ChatConversation) => void;
}

export const ConversationList = ({ conversations, currentUserId, onConversationSelect }: ConversationListProps) => {
  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isClient = conversation.cliente_id === currentUserId;
        const otherUser = isClient ? conversation.prestador : conversation.cliente;
        
        const getStatusBadge = () => {
          switch (conversation.status) {
            case 'aguardando_preco':
              return <Badge variant="secondary">Aguardando Preço</Badge>;
            case 'preco_definido':
              return <Badge variant="outline">Preço Definido</Badge>;
            case 'aceito':
              return <Badge className="bg-green-500">Aceito</Badge>;
            case 'rejeitado':
              return <Badge variant="destructive">Rejeitado</Badge>;
            case 'bloqueado':
              return <Badge variant="destructive">Bloqueado</Badge>;
            default:
              return null;
          }
        };

        return (
          <Card
            key={conversation.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onConversationSelect(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={otherUser?.foto_url} alt={otherUser?.nome} />
                  <AvatarFallback>
                    {otherUser?.nome?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {otherUser?.nome || 'Usuário'}
                    </h4>
                    <div className="flex items-center gap-2">
                      {getStatusBadge()}
                      <span className="text-xs text-gray-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {format(new Date(conversation.updated_at), 'HH:mm', { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Serviço:</strong> {conversation.servico_solicitado}
                  </p>
                  
                  {conversation.preco_proposto && (
                    <p className="text-sm text-green-600 font-medium mb-1">
                      Preço: R$ {conversation.preco_proposto.toFixed(2)}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.last_message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
