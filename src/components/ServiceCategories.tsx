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
            const imageUrl = `https://mbzxifrkabfnufliawzo.supabase.co/storage/v1/object/public/site-images/${category.image}`;
            const IconComponent = category.icon;
            
            return (
              <Card 
                key={category.id} 
                className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-border rounded-2xl overflow-hidden animate-on-scroll group" 
                style={{
                  animationDelay: `${index * 0.1}s`
                }} 
                onClick={() => onCategorySelect(category.serviceIds)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between h-16">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    <div className="w-16 h-16 flex items-center justify-center bg-muted/50 rounded-xl ml-4 group-hover:bg-primary/10 transition-colors">
                      <img 
                        src={imageUrl} 
                        alt={category.name}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const container = target.parentElement;
                          if (container) {
                            const iconElement = document.createElement('div');
                            iconElement.className = 'text-primary';
                            container.appendChild(iconElement);
                            // Render the Lucide icon as fallback
                            const icon = IconComponent ? IconComponent : null;
                            if (icon) {
                              iconElement.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="12 6v6l4 2"/></svg>`;
                            }
                          }
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