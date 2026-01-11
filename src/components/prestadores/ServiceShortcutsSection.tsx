
import React, { useState, useEffect, useRef } from 'react';
import { CategoryShortcutButton } from './CategoryShortcutButton';
import { serviceCategories } from '@/config/serviceCategories';
import { getServicos } from '@/utils/database/servicos';
import { getServiceIcon } from '@/config/serviceCategories';

interface ServiceShortcutsSectionProps {
  onCategorySelect: (serviceIds: string[]) => void;
  selectedServices: string[];
}

interface Servico {
  id: string;
  nome: string;
  ativo: boolean;
}

export const ServiceShortcutsSection: React.FC<ServiceShortcutsSectionProps> = ({
  onCategorySelect,
  selectedServices
}) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  // Drag functionality
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    loadServicos();
  }, []);

  const loadServicos = async () => {
    try {
      const servicosData = await getServicos();
      setServicos(servicosData);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create dynamic categories based on active services
  const createDynamicCategories = () => {
    const categoriesMap = new Map();

    // Group services by their categories
    servicos.forEach(servico => {
      const iconConfig = getServiceIcon(servico.nome);
      const categoryName = getCategoryName(servico.nome);

      if (!categoriesMap.has(categoryName)) {
        const category = serviceCategories.find(cat => cat.name === categoryName);
        if (category) {
          categoriesMap.set(categoryName, {
            ...category,
            serviceIds: []
          });
        }
      }

      if (categoriesMap.has(categoryName)) {
        categoriesMap.get(categoryName).serviceIds.push(servico.id);
      }
    });

    return Array.from(categoriesMap.values());
  };

  // Helper function to map service names to category names
  const getCategoryName = (serviceName: string): string => {
    const name = serviceName.toLowerCase();

    if (['limpeza', 'diarista'].includes(name)) return 'Limpeza';
    if (['montador de móveis', 'pedreiro', 'encanador'].includes(name)) return 'Reparos';
    if (['eletricista'].includes(name)) return 'Elétrica';
    if (['beleza', 'cabeleireiro(a)'].includes(name)) return 'Beleza';
    if (['construção', 'pintor'].includes(name)) return 'Construção';
    if (['jardineiro'].includes(name)) return 'Jardinagem';
    if (['fretes'].includes(name)) return 'Fretes';
    if (['cozinha'].includes(name)) return 'Cozinha';
    if (['serviços de ti'].includes(name)) return 'Tecnologia';
    if (['babá', 'cuidador(a) de idosos', 'pet care'].includes(name)) return 'Cuidados';
    if (['refrigeração'].includes(name)) return 'Refrigeração';

    return 'Outros';
  };

  const availableCategories = loading ? [] : createDynamicCategories();

  // Drag event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll speed multiplier
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (availableCategories.length === 0 && !loading) return null;

  const handleCategoryClick = (category: typeof serviceCategories[0]) => {
    onCategorySelect(category.serviceIds || []);
  };

  const isCategorySelected = (category: typeof serviceCategories[0]) => {
    if (!category.serviceIds || category.serviceIds.length === 0) return false;
    return category.serviceIds.some(serviceId => selectedServices.includes(serviceId));
  };

  if (loading) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">
          Categorias de Serviços
        </h2>
        <div className="flex gap-3 pb-2 px-1">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="min-w-[100px] h-24 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">
        Categorias de Serviços
      </h2>

      {/* Enhanced scrollable carousel with drag functionality */}
      <div className="relative">
        <div
          ref={scrollRef}
          className={`overflow-x-auto scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
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
