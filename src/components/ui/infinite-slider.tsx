
import React from 'react';
import { cn } from '@/lib/utils';

interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  reverse?: boolean;
  className?: string;
}

export const InfiniteSlider: React.FC<InfiniteSliderProps> = ({
  children,
  gap = 24,
  reverse = false,
  className
}) => {
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <div 
        className={`flex animate-scroll ${reverse ? 'animate-reverse' : ''}`}
        style={{ gap: `${gap}px` }}
      >
        {children}
        {children}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-reverse {
          animation: reverse 30s linear infinite;
        }
      `}</style>
    </div>
  );
};
