import { Wrench, Zap, Scissors, Brush, Hammer, TreePine, Car, Home, Laptop, Baby } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef } from 'react';
const categories = [{
  id: 'limpeza',
  name: 'Limpeza',
  icon: Brush,
  color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
}, {
  id: 'reparos',
  name: 'Reparos',
  icon: Wrench,
  color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
}, {
  id: 'eletrica',
  name: 'Elétrica',
  icon: Zap,
  color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
}, {
  id: 'beleza',
  name: 'Beleza',
  icon: Scissors,
  color: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
}, {
  id: 'marido-aluguel',
  name: 'Marido de Aluguel',
  icon: Hammer,
  color: 'bg-green-50 border-green-200 hover:bg-green-100'
}, {
  id: 'jardinagem',
  name: 'Jardinagem',
  icon: TreePine,
  color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
}, {
  id: 'automotivo',
  name: 'Automotivo',
  icon: Car,
  color: 'bg-red-50 border-red-200 hover:bg-red-100'
}, {
  id: 'domestico',
  name: 'Doméstico',
  icon: Home,
  color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
}, {
  id: 'tecnologia',
  name: 'Tecnologia',
  icon: Laptop,
  color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
}, {
  id: 'cuidados',
  name: 'Cuidados',
  icon: Baby,
  color: 'bg-teal-50 border-teal-200 hover:bg-teal-100'
}];
interface ServiceCategoriesProps {
  onCategorySelect: (categoryId: string) => void;
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
  return <section ref={categoriesRef} className="bg-gradient-to-b from-orange-50/50 to-white py-0">
      <div className="max-w-7xl mx-auto px-[29px] my-[26px]">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha sua <span className="text-gradient">categoria</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre o profissional ideal para resolver suas necessidades
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => {
          const IconComponent = category.icon;
          return <Card key={category.id} className={`cursor-pointer transition-all duration-500 hover-lift border-2 ${category.color} animate-on-scroll`} style={{
            animationDelay: `${index * 0.1}s`
          }} onClick={() => onCategorySelect(category.id)}>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 orange-gradient rounded-2xl flex items-center justify-center shadow-lg">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{category.name}</h3>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>
    </section>;
};
export default ServiceCategories;