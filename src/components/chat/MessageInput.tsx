import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, X } from 'lucide-react';
import { ImageUploadInfo } from '@/hooks/useEnhancedChat';
import { toast } from 'sonner';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onUploadImage: (file: File) => void;
  imageUploadInfo: ImageUploadInfo;
  disabled?: boolean;
  sending?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onUploadImage,
  imageUploadInfo,
  disabled = false,
  sending = false
}) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled) return;

    // Verificar limite diário
    if (imageUploadInfo.remaining <= 0) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite de 5 imagens por dia.",
        variant: "destructive"
      });
      return;
    }

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    // Verificar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      await onUploadImage(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      // Limpar o input
      e.target.value = '';
    }
  };

  if (disabled) {
    return (
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-center py-2">
          <p className="text-sm text-gray-500">
            <X className="h-4 w-4 inline mr-1" />
            Esta conversa foi bloqueada
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t bg-white">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="resize-none"
            disabled={disabled}
          />
        </div>
        
        <div className="flex gap-2">
          {/* Upload de imagem */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={disabled || isUploading || imageUploadInfo.remaining <= 0}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || isUploading || imageUploadInfo.remaining <= 0}
              className="relative"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            type="submit" 
            size="sm" 
            disabled={!message.trim() || disabled || sending}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
      
      {/* Indicador de limite de imagens */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Imagens restantes hoje: {imageUploadInfo.remaining}/{imageUploadInfo.total}
      </div>
    </div>
  );
};
