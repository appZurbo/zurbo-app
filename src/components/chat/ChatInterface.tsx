
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Send, 
  Image as ImageIcon, 
  AlertTriangle, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Download
} from 'lucide-react';
import { ChatConversation, ChatMessage, ImageUploadInfo } from '@/hooks/useEnhancedChat';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { ChatHistoryDownload } from './ChatHistoryDownload';

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

export const ChatInterface = ({
  conversation,
  messages,
  imageUploadInfo,
  onSendMessage,
  onUploadImage,
  onSetPrice,
  onRespondToPrice,
  onReportUser
}: ChatInterfaceProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportIssue, setReportIssue] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useAuth();

  const isClient = conversation.cliente_id === profile?.id;
  const otherUser = isClient ? conversation.prestador : conversation.cliente;
  const canSendMessages = conversation.status !== 'bloqueado';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && canSendMessages) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canSendMessages) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 10MB.');
        return;
      }
      if (imageUploadInfo.remaining <= 0) {
        alert('Limite diário de imagens atingido.');
        return;
      }
      onUploadImage(file);
    }
  };

  const handleSetPrice = () => {
    const price = parseFloat(priceValue);
    if (price > 0) {
      onSetPrice(price);
      setShowPriceDialog(false);
      setPriceValue('');
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

  const getStatusDisplay = () => {
    switch (conversation.status) {
      case 'aguardando_preco':
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-yellow-600">Aguardando definição de preço</span>
          </div>
        );
      case 'preco_definido':
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-600">
              Preço proposto: R$ {conversation.preco_proposto?.toFixed(2)}
            </span>
          </div>
        );
      case 'aceito':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600">Serviço aceito - Pedido criado</span>
          </div>
        );
      case 'rejeitado':
        return (
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600">Preço rejeitado</span>
          </div>
        );
      case 'bloqueado':
        return (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600">Conversa bloqueada</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser?.foto_url} alt={otherUser?.nome} />
              <AvatarFallback>
                {otherUser?.nome?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{otherUser?.nome || 'Usuário'}</CardTitle>
              <p className="text-sm text-gray-600">
                <strong>Serviço:</strong> {conversation.servico_solicitado}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ChatHistoryDownload 
              chat={{
                id: conversation.id,
                cliente_id: conversation.cliente_id,
                prestador_id: conversation.prestador_id,
                created_at: conversation.created_at,
                updated_at: conversation.updated_at,
                cliente: conversation.cliente,
                prestador: conversation.prestador
              } as any}
              messages={messages as any[]}
            />
            
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Denunciar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Denunciar Usuário</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="issue-type">Motivo da Denúncia</Label>
                    <Select value={reportIssue} onValueChange={setReportIssue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spam">Spam</SelectItem>
                        <SelectItem value="harassment">Assédio</SelectItem>
                        <SelectItem value="inappropriate">Conteúdo Inapropriado</SelectItem>
                        <SelectItem value="fraud">Fraude</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o problema..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleReport} className="w-full">
                    Enviar Denúncia
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="mt-2">
          {getStatusDisplay()}
        </div>
      </CardHeader>

      <Separator />

      {/* Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isFromCurrentUser = message.sender_id === profile?.id;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isFromCurrentUser
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.message_type === 'image' ? (
                      <img
                        src={message.image_url}
                        alt="Imagem"
                        className="max-w-full h-auto rounded"
                      />
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        isFromCurrentUser ? 'text-orange-100' : 'text-gray-500'
                      }`}
                    >
                      {format(new Date(message.created_at), 'HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      {/* Action Buttons */}
      {canSendMessages && (
        <>
          <Separator />
          <div className="p-4 space-y-3">
            {/* Price Actions */}
            {conversation.status === 'aguardando_preco' && !isClient && (
              <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Definir Preço
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Definir Preço do Serviço</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0,00"
                        value={priceValue}
                        onChange={(e) => setPriceValue(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSetPrice} className="w-full">
                      Confirmar Preço
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {conversation.status === 'aguardando_preco' && isClient && (
              <div className="text-center py-2">
                <Badge variant="secondary">Aguardando definição de preço</Badge>
              </div>
            )}

            {conversation.status === 'preco_definido' && isClient && (
              <div className="flex gap-2">
                <Button
                  onClick={() => onRespondToPrice(true)}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aceitar R$ {conversation.preco_proposto?.toFixed(2)}
                </Button>
                <Button
                  onClick={() => onRespondToPrice(false)}
                  variant="outline"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
              </div>
            )}

            {conversation.status === 'preco_definido' && !isClient && (
              <div className="text-center py-2">
                <Badge variant="secondary">
                  Aguardando resposta do cliente - R$ {conversation.preco_proposto?.toFixed(2)}
                </Badge>
              </div>
            )}

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploadInfo.remaining <= 0}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {imageUploadInfo.remaining < imageUploadInfo.total && (
              <p className="text-xs text-gray-500 text-center">
                {imageUploadInfo.remaining} imagens restantes hoje
              </p>
            )}
          </div>
        </>
      )}

      {conversation.status === 'bloqueado' && (
        <div className="p-4 text-center">
          <Badge variant="destructive">Conversa Bloqueada</Badge>
        </div>
      )}
    </div>
  );
};
