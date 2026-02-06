
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
  // Use the image path from the category configuration
  const gridImageUrl = category.image.startsWith('/') ? category.image : `/${category.image}`;

  // Get image positioning based on category needs - optimized scale for better containment
  const getImageStyles = (categoryId: string) => {
    const baseStyles = {
      objectFit: 'cover' as const,
    };

    switch (categoryId) {
      case 'fretes':
      case 'construcao':
      case 'refrigeracao':
      case 'cuidados':
      case 'cozinha':
        // Slightly larger scale for specified categories
        return {
          ...baseStyles,
          objectPosition: 'center',
          transform: 'scale(1)'
        };
      default:
        // Adjust default scale for better 3D icon visibility
        return {
          ...baseStyles,
          objectPosition: 'center',
          transform: 'scale(0.95)'
        };
    }
  };

  const imageStyles = getImageStyles(category.id);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-end p-3 rounded-xl transition-all duration-200 min-w-[100px] h-24 overflow-hidden group hover:scale-105 hover:shadow-md",
      )}
    >
      {/* Background image */}
      <div className={cn("absolute inset-0 rounded-xl", isSelected ? "bg-orange-500" : "bg-white")}>
        <img
          src={gridImageUrl}
          alt={category.name}
          className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-300"
          style={imageStyles}
        />
      </div>

      {/* Category name */}
      <span
        className={cn(
          "relative z-10 text-xs font-semibold text-center leading-tight text-white",
          isSelected ? "text-orange-100" : ""
        )}
        style={{
          textShadow: `
            -1px -1px 0 #000,
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000,
            0px -1px 0 #000,
            0px 1px 0 #000,
            -1px 0px 0 #000,
            1px 0px 0 #000
          `
        }}
      >
        {category.name}
      </span>
    </button>
  );
};
