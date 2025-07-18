import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

interface MessageStatusProps {
  status: MessageStatus;
  timestamp?: string;
  onRetry?: () => void;
  showText?: boolean;
}

export const MessageStatusIndicator: React.FC<MessageStatusProps> = ({
  status,
  timestamp,
  onRetry,
  showText = false
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400 animate-pulse" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-500" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'failed':
        return (
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-red-500" />
            {onRetry && (
              <Button
                size="sm"
                variant="ghost"
                className="h-auto p-0 text-red-500 hover:text-red-600"
                onClick={onRetry}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sending':
        return 'Enviando...';
      case 'sent':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'read':
        return 'Lido';
      case 'failed':
        return 'Falha no envio';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      {getStatusIcon()}
      {showText && <span className="text-gray-500">{getStatusText()}</span>}
      {timestamp && (
        <span className="text-gray-400 ml-1">
          {new Date(timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      )}
    </div>
  );
};