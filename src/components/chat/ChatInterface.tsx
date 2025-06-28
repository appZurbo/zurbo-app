
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Send, 
  Image as ImageIcon, 
  DollarSign, 
  Check, 
  X, 
  Download, 
  Flag,
  AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  sender_id: string;
  message_type: 'text' | 'image' | 'system';
  content?: string;
  image_url?: string;
  created_at: string;
}

interface ChatConversation {
  id: string;
  cliente_id: string;
  prestador_id: string;
  servico_solicitado: string;
  preco_proposto?: number;
  status: string;
  cliente?: { nome: string; foto_url?: string };
  prestador?: { nome: string; foto_url?: string };
}

interface ImageUploadInfo {
  remaining: number;
  total: number;
}

interface ChatInterfaceProps {
  conversation: ChatConversation;
  messages: ChatMessage[];
  imageUploadInfo: ImageUploadInfo;
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
  const [newMessage, setNewMessage] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportIssue, setReportIssue] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

  const isClient = conversation.cliente_id === profile?.id;
  const otherUser = isClient ? conversation.prestador : conversation.cliente;
  const canSetPrice = !isClient && conversation.status === 'aguardando_preco';
  const canRespondToPrice = isClient && conversation.status === 'preco_definido';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  const handleSetPrice = () => {
    const price = parseFloat(priceInput);
    if (price > 0) {
      onSetPrice(price);
      setShowPriceDialog(false);
      setPriceInput('');
    }
  };

  const handleReport = () => {
    if (reportIssue && reportDescription.trim()) {
      onReportUser(reportIssue, reportDescription.trim());
      setShowReportDialog(false);
      setReportIssue('');
      setReportDescription('');
    }
  };

  const downloadChatHistory = () => {
    const chatText = messages
      .map(msg => {
        const sender = msg.sender_id === profile?.id ? 'Você' : otherUser?.nome || 'Usuário';
        const timestamp = new Date(msg.created_at).toLocaleString('pt-BR');
        
        if (msg.message_type === 'image') {
          return `[${timestamp}] ${sender}: [Imagem enviada]`;
        } else if (msg.message_type === 'system') {
          return `[${timestamp}] Sistema: ${msg.content}`;
        } else {
          return `[${timestamp}] ${sender}: ${msg.content}`;
        }
      })
      .join('\n');

    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversa-${conversation.servico_solicitado}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser?.foto_url} />
              <AvatarFallback>
                {otherUser?.nome?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{otherUser?.nome || 'Usuário'}</h3>
              <p className="text-sm text-gray-500">{conversation.servico_solicitado}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={downloadChatHistory}>
              <Download className="h-4 w-4" />
            </Button>
            
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Denunciar Usuário</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select value={reportIssue} onValueChange={setReportIssue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spam">Spam</SelectItem>
                      <SelectItem value="harassment">Assédio</SelectItem>
                      <SelectItem value="inappropriate">Conteúdo inapropriado</SelectItem>
                      <SelectItem value="fraud">Fraude</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Textarea
                    placeholder="Descreva o problema..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleReport} disabled={!reportIssue || !reportDescription.trim()}>
                      Denunciar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Status and Actions */}
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="outline">
            {conversation.status === 'aguardando_preco' && 'Aguardando Preço'}
            {conversation.status === 'preco_definido' && `Preço: R$ ${conversation.preco_proposto?.toFixed(2)}`}
            {conversation.status === 'aceito' && 'Aceito'}
            {conversation.status === 'rejeitado' && 'Rejeitado'}
            {conversation.status === 'bloqueado' && 'Bloqueado'}
          </Badge>
          
          <div className="flex gap-2">
            {canSetPrice && (
              <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Definir Preço
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Definir Preço do Serviço</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Valor (R$)</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowPriceDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSetPrice} disabled={!priceInput || parseFloat(priceInput) <= 0}>
                        Definir Preço
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            {canRespondToPrice && (
              <div className="flex gap-1">
                <Button size="sm" onClick={() => onRespondToPrice(true)}>
                  <Check className="h-4 w-4 mr-1" />
                  Aceitar
                </Button>
                <Button size="sm" variant="outline" onClick={() => onRespondToPrice(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Recusar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwn = message.sender_id === profile?.id;
            const isSystem = message.message_type === 'system';
            
            if (isSystem) {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    {message.content}
                  </div>
                </div>
              );
            }
            
            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn ? 'bg-orange-500 text-white' : 'bg-gray-100'
                }`}>
                  {message.message_type === 'image' ? (
                    <img 
                      src={message.image_url} 
                      alt="Imagem enviada" 
                      className="rounded max-w-full h-auto"
                    />
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <p className={`text-xs mt-1 ${isOwn ? 'text-orange-100' : 'text-gray-500'}`}>
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      {conversation.status !== 'bloqueado' && (
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageUploadInfo.remaining <= 0}
            >
              <ImageIcon className="h-4 w-4" />
              <span className="ml-1 text-xs">({imageUploadInfo.remaining})</span>
            </Button>
            
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            
            <Button type="submit" size="sm" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
