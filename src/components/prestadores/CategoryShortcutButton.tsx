
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

  // Mapeamento das imagens do grid para usar PNGs da pasta icons/
  const getGridImageUrl = (categoryId: string) => {
    const gridImageMap: Record<string, string> = {
      'limpeza': 'icons/limpeza.png',
      'reparos': 'icons/reparos.png',
      'eletrica': 'icons/eletricista.png',
      'beleza': 'icons/beleza.png',
      'construcao': 'icons/construcao.png',
      'jardinagem': 'icons/jardineiro.png',
      'fretes': 'icons/fretes.png',
      'chaveiro': 'icons/chaveiro.png',
      'cozinha': 'icons/cozinha.png',
      'tecnologia': 'icons/tecnologia.png',
      'cuidados': 'icons/cuidados (1).png',
      'refrigeracao': 'icons/refrigeracao.png',
      'mecanico': 'icons/mecanico.png'
    };
    return gridImageMap[categoryId] || category.image;
  };

  const gridImageUrl = `/${getGridImageUrl(category.id)}`;

  // Get image positioning based on category needs - center images with reduced scale
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
        // Larger scale for specific categories (20% increase from 0.88)
        return {
          ...baseStyles,
          objectPosition: 'center',
          transform: 'scale(1.056)'
        };
      case 'limpeza':
      case 'beleza':
      case 'reparos':
      case 'eletrica':
      case 'jardinagem':
      case 'tecnologia':
      case 'chaveiro':
      case 'mecanico':
        // Center images with slightly larger scale
        return {
          ...baseStyles,
          objectPosition: 'center',
          transform: 'scale(0.88)'
        };
      default:
        return {
          ...baseStyles,
          objectPosition: 'center',
          transform: 'scale(0.88)'
        };
    }
  };

  const imageStyles = getImageStyles(category.id);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-end p-3 rounded-xl transition-all duration-200 min-w-[100px] h-24 overflow-hidden group hover:overflow-visible",
        isSelected
          ? "shadow-md"
          : "",
        "hover:scale-105 hover:shadow-md"
      )}
    >
      {/* Background image */}
      <div className={cn("absolute inset-0", isSelected ? "bg-orange-500" : "bg-white")}>
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
