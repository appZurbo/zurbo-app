
import { useState } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PrestadorCard from './PrestadorCard';

interface PrestadorListProps {
  category?: string;
  onViewProfile: (id: string) => void;
  onSchedule: (id: string) => void;
  onChat: (id: string) => void;
}

const mockPrestadores = [
  {
    id: '1',
    name: 'Ana Silva',
    rating: 4.8,
    reviewCount: 127,
    distance: '0.8 km',
    category: 'Limpeza Residencial',
    price: 'R$ 80/dia',
    description: 'Profissional experiente em limpeza residencial e comercial. Trabalho com produtos próprios e equipamentos modernos.',
    responseTime: '~15 min',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Carlos Santos',
    rating: 4.9,
    reviewCount: 89,
    distance: '1.2 km',
    category: 'Eletricista',
    price: 'R$ 120/hora',
    description: 'Eletricista profissional com mais de 10 anos de experiência. Atendo emergências 24h.',
    responseTime: '~30 min',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    rating: 4.7,
    reviewCount: 203,
    distance: '2.1 km',
    category: 'Cabeleireira',
    price: 'R$ 60/serviço',
    description: 'Cabeleireira especializada em cortes modernos e coloração. Atendimento domiciliar disponível.',
    responseTime: '~45 min',
    isOnline: true,
  },
];

const PrestadorList = ({ category, onViewProfile, onSchedule, onChat }: PrestadorListProps) => {
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {category ? `Prestadores - ${category}` : 'Prestadores Disponíveis'}
        </h2>
        
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Melhor avaliados</SelectItem>
              <SelectItem value="distance">Mais próximos</SelectItem>
              <SelectItem value="price">Menor preço</SelectItem>
              <SelectItem value="reviews">Mais contratados</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Faixa de preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-50">R$ 0 - 50</SelectItem>
                <SelectItem value="50-100">R$ 50 - 100</SelectItem>
                <SelectItem value="100-200">R$ 100 - 200</SelectItem>
                <SelectItem value="200+">R$ 200+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Distância" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Até 1 km</SelectItem>
                <SelectItem value="5">Até 5 km</SelectItem>
                <SelectItem value="10">Até 10 km</SelectItem>
                <SelectItem value="any">Qualquer distância</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Avaliação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4.5">4.5+ estrelas</SelectItem>
                <SelectItem value="4.0">4.0+ estrelas</SelectItem>
                <SelectItem value="3.5">3.5+ estrelas</SelectItem>
                <SelectItem value="any">Qualquer avaliação</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Disponibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online agora</SelectItem>
                <SelectItem value="today">Disponível hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="any">Qualquer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {mockPrestadores.map((prestador) => (
          <PrestadorCard
            key={prestador.id}
            prestador={prestador}
            onViewProfile={onViewProfile}
            onSchedule={onSchedule}
            onChat={onChat}
          />
        ))}
      </div>
    </div>
  );
};

export default PrestadorList;
