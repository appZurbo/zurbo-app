
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IconeDestaqueProps {
  isDestaque: boolean;
}

export const IconeDestaque: React.FC<IconeDestaqueProps> = ({ isDestaque }) => {
  if (!isDestaque) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <CheckCircle className="h-5 w-5 text-blue-500 fill-current" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Prestador Destaque - Nota 4+ com 10+ serviços</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
