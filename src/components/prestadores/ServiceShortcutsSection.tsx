
import React from 'react';
import { CategoryShortcutButton } from './CategoryShortcutButton';
import { serviceCategories } from '@/config/serviceCategories';

interface ServiceShortcutsSectionProps {
  onCategorySelect: (serviceIds: string[]) => void;
  selectedServices: string[];
}

export const ServiceShortcutsSection: React.FC<ServiceShortcutsSectionProps> = ({
  onCategorySelect,
  selectedServices
}) => {
  // Filter out categories that have no serviceIds (like chaveiro and mecanico)
  const availableCategories = serviceCategories.filter(category => 
    category.serviceIds && category.serviceIds.length > 0
  );

  if (availableCategories.length === 0) return null;

  const handleCategoryClick = (category: typeof serviceCategories[0]) => {
    onCategorySelect(category.serviceIds);
  };

  const isCategorySelected = (category: typeof serviceCategories[0]) => {
    return category.serviceIds.some(serviceId => selectedServices.includes(serviceId));
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">
        Categorias de Serviços
      </h2>
      
      {/* Enhanced scrollable carousel with better mobile indicators */}
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2 px-1" style={{ width: 'max-content' }}>
            {availableCategories.map((category) => (
              <CategoryShortcutButton
                key={category.id}
                category={category}
                isSelected={isCategorySelected(category)}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </div>
        
        {/* Mobile scroll indicators */}
        <div className="flex justify-center mt-2 gap-1 md:hidden">
          {availableCategories.slice(0, Math.ceil(availableCategories.length / 3)).map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-gray-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
