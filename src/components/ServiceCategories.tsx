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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceCategories.map((category, index) => {
            const imageUrl = `https://mbzxifrkabfnufliawzo.supabase.co/storage/v1/object/public/site-images/${category.image}`;
            return (
              <Card 
                key={category.id} 
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200 rounded-xl overflow-hidden animate-on-scroll" 
                style={{
                  animationDelay: `${index * 0.1}s`
                }} 
                onClick={() => onCategorySelect(category.serviceIds)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{category.name}</h3>
                    </div>
                    <div className="w-16 h-16 flex items-center justify-center">
                      <img 
                        src={imageUrl} 
                        alt={category.name}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
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