
import React from 'react';
import { cn } from '@/lib/utils';

interface ServiceShortcutButtonProps {
  servico: { id: string; nome: string; icone: string; cor?: string };
  iconConfig: { 
    icon: React.ComponentType<any>; 
    color: string; 
    bgColor: string; 
  };
  isSelected: boolean;
  onClick: () => void;
}

export const ServiceShortcutButton: React.FC<ServiceShortcutButtonProps> = ({
  servico,
  iconConfig,
  isSelected,
  onClick
}) => {
  const { icon: Icon, color, bgColor } = iconConfig;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 min-w-[80px] h-20",
        isSelected 
          ? "border-orange-500 bg-orange-50 shadow-md" 
          : `border-gray-200 ${bgColor}`,
        "hover:scale-105 hover:shadow-md"
      )}
    >
      <Icon 
        className={cn(
          "h-6 w-6 mb-1",
          isSelected ? "text-orange-600" : color
        )} 
      />
      <span className={cn(
        "text-xs font-medium text-center leading-tight",
        isSelected ? "text-orange-800" : "text-gray-700"
      )}>
        {servico.nome}
      </span>
    </button>
  );
};
