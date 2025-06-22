
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const { chats, currentChat, setCurrentChat } = useChat();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setCurrentChat(chatId);
  };

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
        
        <CardContent className="flex-1 p-0 flex">
          {!selectedChatId ? (
            <ScrollArea className="flex-1 p-3">
              {chats.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>Nenhuma conversa</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {chats.map((chat) => {
                    const otherUser = chat.cliente?.nome !== undefined ? chat.cliente : chat.prestador;
                    return (
                      <div
                        key={chat.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => handleChatSelect(chat.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            {otherUser?.nome?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{otherUser?.nome}</p>
                            {chat.last_message && (
                              <p className="text-xs text-gray-500 truncate">
                                {chat.last_message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="p-3 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedChatId(null)}
                  className="mb-2"
                >
                  ← Voltar
                </Button>
              </div>
              <MessageList />
              <MessageInput />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
