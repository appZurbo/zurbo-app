
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type FilterType = 'todos' | 'pendente' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado';

interface FilterTabsProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  isPrestador: boolean;
  isMobile: boolean;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  filter,
  onFilterChange,
  isPrestador,
  isMobile
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {isPrestador ? 'Pedidos Recebidos' : 'Meus Agendamentos'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(value) => onFilterChange(value as FilterType)}>
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} h-auto p-1`}>
            <TabsTrigger value="todos" className="text-xs py-2 px-3">
              Todos
            </TabsTrigger>
            <TabsTrigger value="pendente" className="text-xs py-2 px-3">
              Pendente
            </TabsTrigger>
            <TabsTrigger value="aceito" className="text-xs py-2 px-3">
              Aceito
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="em_andamento" className="text-xs py-2 px-3">
                  Andamento
                </TabsTrigger>
                <TabsTrigger value="concluido" className="text-xs py-2 px-3">
                  Concluído
                </TabsTrigger>
                <TabsTrigger value="cancelado" className="text-xs py-2 px-3">
                  Cancelado
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};
