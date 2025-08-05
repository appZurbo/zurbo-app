
import React from 'react';
import { cn } from '@/lib/utils';
import { ServiceCategory } from '@/config/serviceCategories';

interface CategoryShortcutButtonProps {
  category: ServiceCategory;
  isSelected: boolean;
  onClick: () => void;
}

export const CategoryShortcutButton: React.FC<CategoryShortcutButtonProps> = ({
  category,
  isSelected,
  onClick
}) => {
  const imageUrl = `/${category.image}`;

  // Get image positioning based on category needs - move images down to show more content
  const getImageStyles = (categoryId: string) => {
    const baseStyles = {
      objectFit: 'cover' as const,
    };

    switch (categoryId) {
      case 'fretes':
        return {
          ...baseStyles,
          objectPosition: 'center top',
          transform: 'scale(1.2) translateY(-5px)'
        };
      case 'limpeza':
      case 'beleza':
      case 'reparos':
      case 'eletrica':
      case 'construcao':
      case 'jardinagem':
      case 'refrigeracao':
      case 'cuidados':
      case 'tecnologia':
        // Move image down to show faces clearly
        return {
          ...baseStyles,
          objectPosition: 'center top',
          transform: 'scale(1.6) translateY(15px)'
        };
      default:
        return {
          ...baseStyles,
          objectPosition: 'center top',
          transform: 'scale(1.4) translateY(10px)'
        };
    }
  };

  const imageStyles = getImageStyles(category.id);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-end p-3 rounded-xl border-2 transition-all duration-200 min-w-[100px] h-24 overflow-hidden group",
        isSelected 
          ? "border-orange-500 shadow-md" 
          : "border-gray-200 hover:border-gray-300",
        "hover:scale-105 hover:shadow-md"
      )}
    >
      {/* Background image */}
      <div className="absolute inset-0 bg-white">
        <img
          src={imageUrl}
          alt={category.name}
          className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-300"
          style={imageStyles}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      
      {/* Category name */}
      <span className={cn(
        "relative z-10 text-xs font-semibold text-center leading-tight text-white drop-shadow-md",
        isSelected ? "text-orange-100" : ""
      )}>
        {category.name}
      </span>
    </button>
  );
};
