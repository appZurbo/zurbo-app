
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
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
        <h2 className="text-lg font-black text-gray-900 uppercase tracking-tighter leading-none">
          {isPrestador ? 'Pedidos' : 'Meus'} <span className="text-orange-500">{isPrestador ? 'Recebidos' : 'Agendamentos'}</span>
        </h2>
      </div>

      <div className="p-1 bg-gray-100/80 backdrop-blur-sm rounded-2xl flex gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'todos', label: 'Todos' },
          { id: 'pendente', label: 'Pendente' },
          { id: 'aceito', label: 'Aceito' },
          ...(isMobile ? [] : [
            { id: 'em_andamento', label: 'Andamento' },
            { id: 'concluido', label: 'Concluído' },
            { id: 'cancelado', label: 'Cancelado' }
          ])
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id as FilterType)}
            className={`
              flex-1 min-w-fit whitespace-nowrap rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all
              ${filter === tab.id
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
