
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Conversation {
  id: string;
  cliente_id: string;
  prestador_id: string;
  servico_solicitado: string;
  status: string;
  updated_at: string;
  last_message?: string;
  cliente?: { nome: string; foto_url?: string };
  prestador?: { nome: string; foto_url?: string };
}

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  onConversationSelect: (conversation: Conversation) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentUserId,
  onConversationSelect
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      aguardando_preco: { label: 'Aguardando Preço', color: 'bg-yellow-100 text-yellow-800' },
      preco_definido: { label: 'Preço Definido', color: 'bg-blue-100 text-blue-800' },
      aceito: { label: 'Aceito', color: 'bg-green-100 text-green-800' },
      rejeitado: { label: 'Rejeitado', color: 'bg-red-100 text-red-800' },
      bloqueado: { label: 'Bloqueado', color: 'bg-gray-100 text-gray-800' }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.aguardando_preco;
  };

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isClient = conversation.cliente_id === currentUserId;
        const otherUser = isClient ? conversation.prestador : conversation.cliente;
        const statusInfo = getStatusBadge(conversation.status);
        
        return (
          <div
            key={conversation.id}
            onClick={() => onConversationSelect(conversation)}
            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherUser?.foto_url} />
                <AvatarFallback>
                  {otherUser?.nome?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm truncate">
                    {otherUser?.nome || 'Usuário'}
                  </h4>
                  <Badge className={`text-xs ${statusInfo.color}`}>
                    {statusInfo.label}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-1">
                  {conversation.servico_solicitado}
                </p>
                
                <p className="text-xs text-gray-500 truncate">
                  {conversation.last_message || 'Nova conversa'}
                </p>
                
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(conversation.updated_at), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
