import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, X, Check } from 'lucide-react';
import { getServiceIcon } from '@/config/serviceCategories';
import { getServicos } from '@/utils/database/servicos';

interface ServiceFilterPopoverProps {
  selectedServices: string[];
  onSelectionChange: (services: string[]) => void;
}

export const ServiceFilterPopover: React.FC<ServiceFilterPopoverProps> = ({
  selectedServices,
  onSelectionChange
}) => {
  const [open, setOpen] = useState(false);
  const [servicos, setServicos] = useState<Array<{ id: string; nome: string; icone?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServicos();
  }, []);

  const loadServicos = async () => {
    try {
      console.log('🔄 ServiceFilterPopover: Loading services from database...');
      const servicosData = await getServicos();
      console.log(`✅ ServiceFilterPopover: Loaded ${servicosData.length} active services`);
      setServicos(servicosData);
    } catch (error) {
      console.error('❌ ServiceFilterPopover: Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (servicoId: string) => {
    const newSelection = selectedServices.includes(servicoId)
      ? selectedServices.filter(id => id !== servicoId)
      : [...selectedServices, servicoId];
    
    onSelectionChange(newSelection);
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  const selectedCount = selectedServices.length;

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        Carregando...
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={selectedCount === 0 ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectionChange([])}
        className={selectedCount === 0 ? "bg-orange-500 hover:bg-orange-600" : ""}
      >
        Todos
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            Por Serviço
            {selectedCount > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {selectedCount}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Selecionar Serviços</h4>
              {selectedCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="h-auto p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {servicos.map((servico) => {
                const iconConfig = getServiceIcon(servico.nome);
                const IconComponent = iconConfig.icon;
                const isSelected = selectedServices.includes(servico.id);
                
                return (
                  <div
                    key={servico.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-orange-50 border border-orange-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleServiceToggle(servico.id)}
                  >
                    <div className={`w-8 h-8 rounded-lg ${iconConfig.bgColor} flex items-center justify-center`}>
                      <IconComponent className={`w-4 h-4 ${iconConfig.color}`} />
                    </div>
                    <span className="flex-1 text-sm">{servico.nome}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                );
              })}
            </div>

            {selectedCount > 0 && (
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-500">
                  {selectedCount} serviço{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  function handleServiceToggle(servicoId: string) {
    const newSelection = selectedServices.includes(servicoId)
      ? selectedServices.filter(id => id !== servicoId)
      : [...selectedServices, servicoId];
    
    onSelectionChange(newSelection);
  }

  function clearSelection() {
    onSelectionChange([]);
  }

  const selectedCount = selectedServices.length;
};
