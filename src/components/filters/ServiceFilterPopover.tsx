
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, X } from 'lucide-react';

interface ServiceFilterPopoverProps {
  servicos: Array<{ id: string; nome: string; icone?: string }>;
  selectedServices: string[];
  onSelectionChange: (services: string[]) => void;
}

export const ServiceFilterPopover: React.FC<ServiceFilterPopoverProps> = ({
  servicos,
  selectedServices,
  onSelectionChange
}) => {
  const [open, setOpen] = useState(false);

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
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {servicos.map((servico) => (
                <div key={servico.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={servico.id}
                    checked={selectedServices.includes(servico.id)}
                    onCheckedChange={() => handleServiceToggle(servico.id)}
                  />
                  <label
                    htmlFor={servico.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {servico.nome}
                  </label>
                </div>
              ))}
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
};
