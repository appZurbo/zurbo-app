
import { 
  Wrench, 
  Zap, 
  Scissors, 
  Brush, 
  Hammer, 
  TreePine,
  Car,
  Home,
  Laptop,
  Baby
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  { id: 'limpeza', name: 'Limpeza', icon: Brush, color: 'bg-blue-100 text-blue-600' },
  { id: 'reparos', name: 'Reparos', icon: Wrench, color: 'bg-orange-100 text-orange-600' },
  { id: 'eletrica', name: 'Elétrica', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'beleza', name: 'Beleza', icon: Scissors, color: 'bg-pink-100 text-pink-600' },
  { id: 'marido-aluguel', name: 'Marido de Aluguel', icon: Hammer, color: 'bg-green-100 text-green-600' },
  { id: 'jardinagem', name: 'Jardinagem', icon: TreePine, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'automotivo', name: 'Automotivo', icon: Car, color: 'bg-red-100 text-red-600' },
  { id: 'domestico', name: 'Doméstico', icon: Home, color: 'bg-purple-100 text-purple-600' },
  { id: 'tecnologia', name: 'Tecnologia', icon: Laptop, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'cuidados', name: 'Cuidados', icon: Baby, color: 'bg-teal-100 text-teal-600' },
];

interface ServiceCategoriesProps {
  onCategorySelect: (categoryId: string) => void;
}

const ServiceCategories = ({ onCategorySelect }: ServiceCategoriesProps) => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Categorias de Serviços</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto px-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => onCategorySelect(category.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${category.color}`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCategories;
