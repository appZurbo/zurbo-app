
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Chat, Message } from '@/utils/database/types';
import { supabase } from '@/integrations/supabase/client';

interface ChatHistoryDownloadProps {
  chat: Chat;
  messages: Message[];
}

export const ChatHistoryDownload = ({ chat, messages }: ChatHistoryDownloadProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadChatHistory = async () => {
    setIsDownloading(true);
    try {
      // Buscar dados completos do chat
      const { data: chatData } = await supabase
        .from('chats')
        .select(`
          *,
          cliente:users!cliente_id(id, nome, email),
          prestador:users!prestador_id(id, nome, email)
        `)
        .eq('id', chat.id)
        .single();

      const otherUser = chat.cliente_id === chatData?.cliente?.id ? chatData?.prestador : chatData?.cliente;
      
      // Criar conteúdo do arquivo
      const content = `
==============================================
HISTÓRICO DE CONVERSA - ZURBO
==============================================

INFORMAÇÕES DA EMPRESA:
Zurbo Ltda
Plataforma de Conexão de Prestadores de Serviços
Este documento é gerado automaticamente pelo sistema Zurbo
Data de geração: ${new Date().toLocaleString('pt-BR')}

AVISO LEGAL:
Este histórico é fornecido como registro das interações
realizadas através da plataforma Zurbo. Em caso de disputas
legais, este documento pode ser utilizado como evidência
das comunicações entre as partes.

==============================================

PARTICIPANTES:
- ${chatData?.cliente?.nome || 'Cliente'} (${chatData?.cliente?.email || 'N/A'})
- ${chatData?.prestador?.nome || 'Prestador'} (${chatData?.prestador?.email || 'N/A'})

PERÍODO: ${new Date(chat.created_at).toLocaleString('pt-BR')} até ${new Date().toLocaleString('pt-BR')}

HISTÓRICO DE MENSAGENS:
==============================================

${messages.map(message => {
  const isFromCurrentUser = message.sender_id === chat.cliente_id;
  const senderName = isFromCurrentUser ? (chatData?.cliente?.nome || 'Cliente') : (chatData?.prestador?.nome || 'Prestador');
  
  return `[${new Date(message.created_at).toLocaleString('pt-BR')}] ${senderName}:
${message.content}

---
`;
}).join('')}

==============================================
TOTAL DE MENSAGENS: ${messages.length}
CONVERSA INICIADA EM: ${new Date(chat.created_at).toLocaleString('pt-BR')}
ÚLTIMA ATUALIZAÇÃO: ${new Date(chat.updated_at).toLocaleString('pt-BR')}

Este documento foi gerado automaticamente pela plataforma Zurbo.
Para mais informações, visite: https://zurbo.app
==============================================
      `;

      // Criar e fazer download do arquivo
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zurbo-conversa-${otherUser?.nome?.replace(/[^a-zA-Z0-9]/g, '-') || 'chat'}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("O histórico da conversa foi baixado com sucesso.");
    } catch (error) {
      console.error('Error downloading chat history:', error);
      toast.error("Não foi possível baixar o histórico da conversa.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={downloadChatHistory}
      disabled={isDownloading}
      className="flex items-center gap-2"
    >
      {isDownloading ? (
        <FileText className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isDownloading ? 'Baixando...' : 'Download Histórico'}
    </Button>
  );
};
