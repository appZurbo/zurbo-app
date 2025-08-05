import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef } from 'react';
import { serviceCategories, type ServiceCategory } from '@/config/serviceCategories';

interface ServiceCategoriesProps {
  onCategorySelect: (serviceIds: string[]) => void;
}
const ServiceCategories = ({
  onCategorySelect
}: ServiceCategoriesProps) => {
  const categoriesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });
    const cards = categoriesRef.current?.querySelectorAll('.animate-on-scroll');
    cards?.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={categoriesRef} className="bg-gradient-to-b from-orange-50/50 to-white py-0">
      <div className="max-w-7xl mx-auto px-0 my-0">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha sua <span className="text-gradient">categoria</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre o profissional ideal para resolver suas necessidades
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {serviceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id} 
                className={`cursor-pointer transition-all duration-500 hover-lift border-2 ${category.color} animate-on-scroll`} 
                style={{
                  animationDelay: `${index * 0.1}s`
                }} 
                onClick={() => onCategorySelect(category.serviceIds)}
              >
                <CardContent className="p-8 text-center py-0 px-0 my-[5px]">
                  <div className="w-16 h-16 mx-auto mb-4 orange-gradient rounded-2xl flex items-center justify-center shadow-lg">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{category.name}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default ServiceCategories;