
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, className = "" }) => {
  if (count === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className={`absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse ${className}`}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
};
