
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChatMessage } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  onReportUser: (issueType: string, description: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  onReportUser
}) => {
  const [reportIssueType, setReportIssueType] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const handleReport = () => {
    if (reportIssueType && reportDescription.trim()) {
      onReportUser(reportIssueType, reportDescription);
      setReportIssueType('');
      setReportDescription('');
    }
  };

  const getMessageAlignment = (senderId: string) => {
    return senderId === currentUserId ? 'justify-end' : 'justify-start';
  };

  const getMessageStyle = (senderId: string, messageType: string) => {
    if (messageType === 'system') {
      return 'bg-gray-100 text-gray-700 text-center italic';
    }
    return senderId === currentUserId
      ? 'bg-orange-500 text-white'
      : 'bg-gray-100 text-gray-900';
  };

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-4 py-4">
        {messages.map((message) => {
          const isOwn = message.sender_id === currentUserId;
          const isSystem = message.message_type === 'system';
          
          if (isSystem) {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm max-w-md text-center">
                  {message.content}
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className={`flex ${getMessageAlignment(message.sender_id)}`}>
              <div className="flex max-w-xs lg:max-w-md gap-2">
                {!isOwn && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback>
                      P
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className="flex flex-col">
                  <div className={`px-4 py-2 rounded-lg ${getMessageStyle(message.sender_id, message.message_type)}`}>
                    {message.message_type === 'image' && message.image_url ? (
                      <img 
                        src={message.image_url} 
                        alt="Imagem enviada" 
                        className="max-w-full h-auto rounded"
                      />
                    ) : (
                      <p className="text-sm break-words">{message.content}</p>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                    
                    {!isOwn && (
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem>
                                <Flag className="h-4 w-4 mr-2" />
                                Denunciar usuário
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Denunciar usuário</AlertDialogTitle>
                            <AlertDialogDescription>
                              Descreva o motivo da denúncia. Sua denúncia será analisada pela nossa equipe.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Tipo de problema</label>
                              <Select value={reportIssueType} onValueChange={setReportIssueType}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="spam">Spam</SelectItem>
                                  <SelectItem value="assedio">Assédio</SelectItem>
                                  <SelectItem value="linguagem_inapropriada">Linguagem inapropriada</SelectItem>
                                  <SelectItem value="golpe">Tentativa de golpe</SelectItem>
                                  <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Descrição</label>
                              <Textarea
                                value={reportDescription}
                                onChange={(e) => setReportDescription(e.target.value)}
                                placeholder="Descreva o problema em detalhes..."
                                className="mt-1"
                              />
                            </div>
                          </div>
                          
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleReport}
                              disabled={!reportIssueType || !reportDescription.trim()}
                            >
                              Enviar denúncia
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
                
                {isOwn && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback>
                      Eu
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
