
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X } from 'lucide-react';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { ConversationList } from './ConversationList';
import { ChatInterface } from './ChatInterface';
import { useAuth } from '@/hooks/useAuth';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const { profile } = useAuth();
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    imageUploadInfo,
    sendMessage,
    uploadImage,
    setPrice,
    respondToPrice,
    reportUser,
    loadMessages
  } = useEnhancedChat();

  const handleConversationSelect = (conversation: any) => {
    setCurrentConversation(conversation);
    loadMessages(conversation.id);
  };

  if (!isOpen || !profile) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 z-50">
      <Card className="h-full flex flex-col shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4" />
              Mensagens
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          {!currentConversation ? (
            <ScrollArea className="flex-1 p-3">
              {conversations.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhuma conversa</p>
                </div>
              ) : (
                <ConversationList
                  conversations={conversations}
                  currentUserId={profile.id}
                  onConversationSelect={handleConversationSelect}
                />
              )}
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="p-3 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentConversation(null)}
                  className="mb-2"
                >
                  ← Voltar
                </Button>
              </div>
              
              <div className="flex-1">
                <ChatInterface
                  conversation={currentConversation}
                  messages={messages}
                  imageUploadInfo={imageUploadInfo}
                  onSendMessage={(content) => sendMessage(currentConversation.id, content)}
                  onUploadImage={(file) => uploadImage(currentConversation.id, file)}
                  onSetPrice={(price) => setPrice(currentConversation.id, price)}
                  onRespondToPrice={(accept) => respondToPrice(currentConversation.id, accept)}
                  onReportUser={(issueType, description) => {
                    const reportedUserId = currentConversation.cliente_id === profile.id 
                      ? currentConversation.prestador_id 
                      : currentConversation.cliente_id;
                    reportUser(currentConversation.id, reportedUserId, issueType, description);
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
