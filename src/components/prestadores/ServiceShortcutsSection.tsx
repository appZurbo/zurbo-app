
import React from 'react';
import { ServiceShortcutButton } from './ServiceShortcutButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Key, Paintbrush, Scissors, Droplets, Sparkles, Hammer, Leaf, Truck, Heart, ChefHat, Baby } from 'lucide-react';

interface ServiceShortcutsSectionProps {
  servicos: Array<{ id: string; nome: string; icone: string; cor?: string }>;
  onServiceSelect: (servicoId: string) => void;
  selectedServices: string[];
}

// Mapping of service names to Lucide icons and colors
const serviceIconMap: Record<string, { icon: React.ComponentType<any>; color: string; bgColor: string }> = {
  'chaveiro': { icon: Key, color: 'text-amber-600', bgColor: 'bg-amber-50 hover:bg-amber-100' },
  'fechadura': { icon: Key, color: 'text-amber-600', bgColor: 'bg-amber-50 hover:bg-amber-100' },
  'eletricista': { icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-50 hover:bg-yellow-100' },
  'elétrica': { icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-50 hover:bg-yellow-100' },
  'pintor': { icon: Paintbrush, color: 'text-blue-600', bgColor: 'bg-blue-50 hover:bg-blue-100' },
  'pintura': { icon: Paintbrush, color: 'text-blue-600', bgColor: 'bg-blue-50 hover:bg-blue-100' },
  'cabeleireiro': { icon: Scissors, color: 'text-pink-600', bgColor: 'bg-pink-50 hover:bg-pink-100' },
  'beleza': { icon: Scissors, color: 'text-pink-600', bgColor: 'bg-pink-50 hover:bg-pink-100' },
  'encanador': { icon: Droplets, color: 'text-blue-600', bgColor: 'bg-blue-50 hover:bg-blue-100' },
  'encanamento': { icon: Droplets, color: 'text-blue-600', bgColor: 'bg-blue-50 hover:bg-blue-100' },
  'limpeza': { icon: Sparkles, color: 'text-purple-600', bgColor: 'bg-purple-50 hover:bg-purple-100' },
  'diarista': { icon: Sparkles, color: 'text-purple-600', bgColor: 'bg-purple-50 hover:bg-purple-100' },
  'pedreiro': { icon: Hammer, color: 'text-gray-600', bgColor: 'bg-gray-50 hover:bg-gray-100' },
  'construção': { icon: Hammer, color: 'text-gray-600', bgColor: 'bg-gray-50 hover:bg-gray-100' },
  'jardinagem': { icon: Leaf, color: 'text-green-600', bgColor: 'bg-green-50 hover:bg-green-100' },
  'jardim': { icon: Leaf, color: 'text-green-600', bgColor: 'bg-green-50 hover:bg-green-100' },
  'frete': { icon: Truck, color: 'text-indigo-600', bgColor: 'bg-indigo-50 hover:bg-indigo-100' },
  'mudança': { icon: Truck, color: 'text-indigo-600', bgColor: 'bg-indigo-50 hover:bg-indigo-100' },
  'pet': { icon: Heart, color: 'text-red-600', bgColor: 'bg-red-50 hover:bg-red-100' },
  'veterinário': { icon: Heart, color: 'text-red-600', bgColor: 'bg-red-50 hover:bg-red-100' },
  'cozinheiro': { icon: ChefHat, color: 'text-orange-600', bgColor: 'bg-orange-50 hover:bg-orange-100' },
  'culinária': { icon: ChefHat, color: 'text-orange-600', bgColor: 'bg-orange-50 hover:bg-orange-100' },
  'babá': { icon: Baby, color: 'text-teal-600', bgColor: 'bg-teal-50 hover:bg-teal-100' },
  'cuidador': { icon: Baby, color: 'text-teal-600', bgColor: 'bg-teal-50 hover:bg-teal-100' },
};

const getServiceIcon = (serviceName: string) => {
  const normalizedName = serviceName.toLowerCase();
  for (const [key, value] of Object.entries(serviceIconMap)) {
    if (normalizedName.includes(key)) {
      return value;
    }
  }
  // Default fallback
  return { icon: Hammer, color: 'text-gray-600', bgColor: 'bg-gray-50 hover:bg-gray-100' };
};

export const ServiceShortcutsSection: React.FC<ServiceShortcutsSectionProps> = ({
  servicos,
  onServiceSelect,
  selectedServices
}) => {
  if (servicos.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Serviços Rápidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 gap-3">
          {servicos.slice(0, 12).map((servico) => {
            const iconConfig = getServiceIcon(servico.nome);
            return (
              <ServiceShortcutButton
                key={servico.id}
                servico={servico}
                iconConfig={iconConfig}
                isSelected={selectedServices.includes(servico.id)}
                onClick={() => onServiceSelect(servico.id)}
              />
            );
          })}
        </div>

        {/* Mobile: Scrollable carousel */}
        <div className="md:hidden overflow-x-auto">
          <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
            {servicos.map((servico) => {
              const iconConfig = getServiceIcon(servico.nome);
              return (
                <ServiceShortcutButton
                  key={servico.id}
                  servico={servico}
                  iconConfig={iconConfig}
                  isSelected={selectedServices.includes(servico.id)}
                  onClick={() => onServiceSelect(servico.id)}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
