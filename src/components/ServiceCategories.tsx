
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { serviceCategories, type ServiceCategory } from '@/config/serviceCategories';

interface ServiceCategoriesProps {
  onCategorySelect: (serviceIds: string[]) => void;
}

const ServiceCategories = ({
  onCategorySelect
}: ServiceCategoriesProps) => {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [imageStatuses, setImageStatuses] = useState<{[key: string]: 'loading' | 'loaded' | 'error'}>({});
  
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

  const handleImageLoad = (categoryId: string) => {
    setImageStatuses(prev => ({ ...prev, [categoryId]: 'loaded' }));
  };

  const handleImageError = (categoryId: string) => {
    setImageStatuses(prev => ({ ...prev, [categoryId]: 'error' }));
  };

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
          {serviceCategories.map((category, index) => {
            const imageUrl = `/${category.image}`;
            const IconComponent = category.icon;
            const imageStatus = imageStatuses[category.id] || 'loading';
            
            return (
              <Card 
                key={category.id} 
                className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-border rounded-2xl overflow-hidden animate-on-scroll group" 
                style={{
                  animationDelay: `${index * 0.1}s`
                }} 
                onClick={() => onCategorySelect(category.serviceIds)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4 h-20">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    <div className="w-28 h-20 flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden group-hover:bg-primary/10 transition-colors relative">
                      {imageStatus === 'loading' && (
                        <img 
                          src={imageUrl} 
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover transform scale-175"
                          style={{ 
                            objectPosition: 'center 75%',
                            transformOrigin: 'center bottom'
                          }}
                          onLoad={() => handleImageLoad(category.id)}
                          onError={() => handleImageError(category.id)}
                        />
                      )}
                      {imageStatus === 'loaded' && (
                        <img 
                          src={imageUrl} 
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover transform scale-175 group-hover:scale-185 transition-transform duration-300"
                          style={{ 
                            objectPosition: 'center 75%',
                            transformOrigin: 'center bottom'
                          }}
                        />
                      )}
                      {imageStatus === 'error' && IconComponent && (
                        <div className="text-primary w-8 h-8 flex items-center justify-center">
                          <IconComponent size={24} />
                        </div>
                      )}
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
