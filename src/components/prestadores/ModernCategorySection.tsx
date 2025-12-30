import React from 'react';
import { serviceCategories } from '@/config/serviceCategories';
import { cn } from '@/lib/utils';

interface ModernCategorySectionProps {
  onCategorySelect: (serviceIds: string[]) => void;
  selectedServices: string[];
  showAllLink?: boolean;
}

export const ModernCategorySection: React.FC<ModernCategorySectionProps> = ({
  onCategorySelect,
  selectedServices,
  showAllLink = true
}) => {
  const handleCategoryClick = (category: typeof serviceCategories[0]) => {
    onCategorySelect(category.serviceIds || []);
  };

  const isCategorySelected = (category: typeof serviceCategories[0]) => {
    if (!category.serviceIds || category.serviceIds.length === 0) return false;
    return category.serviceIds.some(serviceId => selectedServices.includes(serviceId));
  };

  // Get icon component
  const getCategoryIcon = (category: typeof serviceCategories[0]) => {
    const IconComponent = category.icon;
    return <IconComponent className="h-8 w-8" />;
  };

  return (
    <div className="mb-8">
      <div className="px-5 mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#3D342B]">Categorias</h2>
        {showAllLink && (
          <button 
            className="text-sm text-[#E05815] font-semibold hover:underline"
            onClick={() => onCategorySelect([])}
          >
            Ver todas
          </button>
        )}
      </div>
      
      <div className="flex overflow-x-auto no-scrollbar px-5 gap-4 pb-2">
        {serviceCategories.map((category) => {
          const isSelected = isCategorySelected(category);
          const IconComponent = category.icon;
          
          return (
            <div 
              key={category.id}
              className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <div 
                className={cn(
                  "size-16 rounded-2xl flex items-center justify-center shadow-sm transition-all",
                  isSelected 
                    ? "bg-[#E0F2FE] text-[#0369A1]" 
                    : "bg-[#E0F2FE] text-[#0369A1] hover:scale-105"
                )}
              >
                <IconComponent className="h-8 w-8" />
              </div>
              <span className="text-xs font-medium text-center text-[#3D342B]">
                {category.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
