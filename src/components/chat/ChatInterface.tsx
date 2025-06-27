
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
  Shield
} from 'lucide-react';
import { ChatConversation, ChatMessage, ImageUploadInfo } from '@/hooks/useEnhancedChat';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';

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
      const reportedUserId = isClient ? conversation.prestador_id : conversation.cliente_id;
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

  const getPriceActionButton = () => {
    if (conversation.status === 'aguardando_preco' && isClient) {
      return (
        <Button onClick={() => setShowPriceDialog(true)} size="sm">
          <DollarSign className="h-4 w-4 mr-2" />
          Combinar Preço
        </Button>
      );
    }

    if (conversation.status === 'preco_definido' && !isClient) {
      return (
        <div className="flex gap-2">
          <Button onClick={() => onRespondToPrice(true)} size="sm" className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            Aceitar
          </Button>
          <Button onClick={() => onRespondToPrice(false)} size="sm" variant="destructive">
            <XCircle className="h-4 w-4 mr-2" />
            Rejeitar
          </Button>
        </div>
      );
    }

    if (conversation.status === 'aguardando_preco' && !isClient) {
      return (
        <Button disabled size="sm" variant="outline">
          <Clock className="h-4 w-4 mr-2" />
          Aguardando Valor
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <CardHeader className="pb-4">
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
              <p className="text-sm text-gray-600">{conversation.servico_solicitado}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getPriceActionButton()}
            
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={conversation.status === 'bloqueado'}>
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
                    <Label htmlFor="issue-type">Tipo de problema</Label>
                    <Select value={reportIssue} onValueChange={setReportIssue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de problema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offensive_language">Linguagem ofensiva</SelectItem>
                        <SelectItem value="fraud">Fraude</SelectItem>
                        <SelectItem value="inappropriate_content">Conteúdo inadequado</SelectItem>
                        <SelectItem value="spam">Spam</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Descreva o problema..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleReport} className="flex-1">
                      Enviar Denúncia
                    </Button>
                    <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                      Cancelar
                    </Button>
                  </div>
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
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.sender_id === profile?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      isOwn
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.message_type === 'text' && (
                      <p className="text-sm">{message.content}</p>
                    )}
                    
                    {message.message_type === 'image' && (
                      <img
                        src={message.image_url}
                        alt="Imagem enviada"
                        className="max-w-full h-auto rounded"
                      />
                    )}
                    
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? 'text-orange-100' : 'text-gray-500'
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

      {/* Message Input */}
      {canSendMessages && (
        <>
          <Separator />
          <div className="p-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploadInfo.remaining <= 0}
                title={`${imageUploadInfo.remaining} uploads restantes hoje`}
              >
                <ImageIcon className="h-4 w-4" />
                <span className="ml-1 text-xs">({imageUploadInfo.remaining})</span>
              </Button>
              
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Price Dialog */}
      <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
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
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSetPrice} className="flex-1">
                Definir Preço
              </Button>
              <Button variant="outline" onClick={() => setShowPriceDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
