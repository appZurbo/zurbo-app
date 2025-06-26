
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const bairrosPopulares = [
  'Vila Madalena', 'Pinheiros', 'Jardins', 'Moema', 'Itaim Bibi',
  'Vila Olímpia', 'Brooklin', 'Campo Belo', 'Santo Amaro', 'Perdizes',
  'Higienópolis', 'Consolação', 'Liberdade', 'Bela Vista', 'República',
  'Santa Cecília', 'Bom Retiro', 'Luz', 'Sé', 'Cambuci'
];

export const BairroSelectionImproved: React.FC = () => {
  const [bairrosSelecionados, setBairrosSelecionados] = useState<Set<string>>(new Set());
  const [novoBairro, setNovoBairro] = useState('');
  const [todosMarcar, setTodosMarcar] = useState(false);

  const toggleBairro = (bairro: string) => {
    const novosBairros = new Set(bairrosSelecionados);
    if (novosBairros.has(bairro)) {
      novosBairros.delete(bairro);
    } else {
      novosBairros.add(bairro);
    }
    setBairrosSelecionados(novosBairros);
  };

  const adicionarBairro = () => {
    if (!novoBairro.trim()) return;
    
    const bairroFormatado = novoBairro.trim();
    if (bairrosSelecionados.has(bairroFormatado)) {
      toast.error('Bairro já adicionado');
      return;
    }

    setBairrosSelecionados(prev => new Set([...prev, bairroFormatado]));
    setNovoBairro('');
    toast.success(`Bairro "${bairroFormatado}" adicionado`);
  };

  const marcarTodos = () => {
    if (todosMarcar) {
      setBairrosSelecionados(new Set());
    } else {
      setBairrosSelecionados(new Set(bairrosPopulares));
    }
    setTodosMarcar(!todosMarcar);
  };

  const removerBairro = (bairro: string) => {
    const novosBairros = new Set(bairrosSelecionados);
    novosBairros.delete(bairro);
    setBairrosSelecionados(novosBairros);
  };

  const salvarBairros = () => {
    if (bairrosSelecionados.size === 0) {
      toast.error('Selecione pelo menos um bairro');
      return;
    }

    toast.success(`${bairrosSelecionados.size} bairros salvos com sucesso!`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Área de Atendimento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Botão Marcar Todos - Fixo no Topo */}
        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border">
          <span className="font-medium text-gray-700">
            Marcar todos os bairros populares
          </span>
          <Button
            onClick={marcarTodos}
            variant={todosMarcar ? "default" : "outline"}
            size="sm"
            className={todosMarcar ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            {todosMarcar ? 'Desmarcar Todos' : 'Marcar Todos'}
          </Button>
        </div>

        {/* Adicionar Bairro Personalizado */}
        <div className="flex gap-2">
          <Input
            value={novoBairro}
            onChange={(e) => setNovoBairro(e.target.value)}
            placeholder="Digite um bairro personalizado..."
            onKeyPress={(e) => e.key === 'Enter' && adicionarBairro()}
          />
          <Button 
            onClick={adicionarBairro}
            variant="outline"
            size="sm"
            disabled={!novoBairro.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Lista de Bairros Populares */}
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-3">
            Bairros Populares
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {bairrosPopulares.map((bairro) => (
              <label
                key={bairro}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  bairrosSelecionados.has(bairro)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={bairrosSelecionados.has(bairro)}
                  onChange={() => toggleBairro(bairro)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {bairro}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Bairros Selecionados */}
        {bairrosSelecionados.size > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2">
              Bairros Selecionados ({bairrosSelecionados.size})
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from(bairrosSelecionados).map(bairro => (
                <Badge 
                  key={bairro}
                  variant="secondary"
                  className="text-xs bg-orange-100 text-orange-800 hover:bg-orange-200"
                >
                  {bairro}
                  <button
                    onClick={() => removerBairro(bairro)}
                    className="ml-1 hover:text-orange-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Botão Salvar */}
        <Button 
          onClick={salvarBairros}
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={bairrosSelecionados.size === 0}
        >
          Salvar Área de Atendimento
        </Button>
      </CardContent>
    </Card>
  );
};
