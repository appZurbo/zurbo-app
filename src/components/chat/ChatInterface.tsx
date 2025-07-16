
import React, { useEffect, useRef } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { PaymentButtons } from './PaymentButtons';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

interface ChatInterfaceProps {
  conversation: any;
  messages: any[];
  imageUploadInfo: any;
  onSendMessage: (content: string) => void;
  onUploadImage: (file: File) => void;
  onSetPrice: (price: number) => void;
  onRespondToPrice: (accept: boolean) => void;
  onReportUser: (issueType: string, description: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversation,
  messages,
  imageUploadInfo,
  onSendMessage,
  onUploadImage,
  onSetPrice,
  onRespondToPrice,
  onReportUser
}) => {
  const { profile } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!profile) return null;

  const isClient = conversation.cliente_id === profile.id;
  const otherUser = isClient ? conversation.prestador : conversation.cliente;
  
  // Verificar se pode definir preço (precisa ter pelo menos 1 mensagem de cada lado)
  const canSetPrice = (conversation.client_message_count || 0) >= 1 && 
                     (conversation.provider_message_count || 0) >= 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aguardando_preco': return 'bg-yellow-100 text-yellow-800';
      case 'preco_definido': return 'bg-blue-100 text-blue-800';
      case 'aceito': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'pagamento_retido': return 'bg-purple-100 text-purple-800';
      case 'em_andamento': return 'bg-orange-100 text-orange-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aguardando_preco': return 'Aguardando Preço';
      case 'preco_definido': return 'Preço Definido';
      case 'aceito': return 'Aceito';
      case 'rejeitado': return 'Rejeitado';
      case 'pagamento_retido': return 'Pagamento Retido';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const handleSendMessageWithType = async (message: string, type?: string, metadata?: any) => {
    // For now, just call the basic onSendMessage
    onSendMessage(message);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header do Chat */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser?.foto_url} />
              <AvatarFallback>
                {otherUser?.nome?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{otherUser?.nome}</h3>
              <p className="text-sm text-gray-600">{conversation.servico_solicitado}</p>
            </div>
          </div>
          <Badge className={getStatusColor(conversation.status)}>
            {getStatusText(conversation.status)}
          </Badge>
        </div>
      </CardHeader>

      {/* Lista de Mensagens */}
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            <MessageList 
              messages={messages} 
              currentUserId={profile.id}
              onReportUser={onReportUser}
            />
            <div ref={messagesEndRef} />
          </div>

          {/* Botões de Pagamento */}
          <PaymentButtons
            conversation={conversation}
            currentUserId={profile.id}
            onSendMessage={handleSendMessageWithType}
          />

          {/* Input de Mensagem */}
          <div className="mt-4">
            <MessageInput
              onSendMessage={onSendMessage}
              onUploadImage={onUploadImage}
              imageUploadInfo={imageUploadInfo}
              disabled={conversation.status === 'bloqueado'}
            />
          </div>

          {/* Aviso se não pode definir preço ainda */}
          {isClient && conversation.status === 'aguardando_preco' && !canSetPrice && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                💬 Continue a conversa para poder definir o preço do serviço
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
};
