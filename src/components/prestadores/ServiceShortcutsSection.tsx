
import React from 'react';
import { CategoryShortcutButton } from './CategoryShortcutButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Categorias de Serviços
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Scrollable carousel for all screen sizes */}
        <div className="overflow-x-auto">
          <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
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
      </CardContent>
    </Card>
  );
};
