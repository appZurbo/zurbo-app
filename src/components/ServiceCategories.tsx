
import { useEffect, useRef } from 'react';
import { serviceCategories } from '@/config/serviceCategories';
import { CategoryModal } from './CategoryModal';

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
    <section ref={categoriesRef} className="bg-gradient-to-b from-muted/30 to-background py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Escolha sua <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">categoria</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encontre o profissional ideal para resolver suas necessidades
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category, index) => (
            <CategoryModal
              key={category.id}
              category={category}
              index={index}
              onCategorySelect={onCategorySelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
