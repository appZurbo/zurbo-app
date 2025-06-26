
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Wrench, Zap, Droplets, Paintbrush, Hammer, Home, Car } from 'lucide-react';
import { toast } from 'sonner';

interface Servico {
  id: string;
  nome: string;
  icone: string;
  cor: string;
}

const servicosDisponiveis: Servico[] = [
  { id: '1', nome: 'Eletricista', icone: 'Zap', cor: '#f59e0b' },
  { id: '2', nome: 'Encanador', icone: 'Droplets', cor: '#3b82f6' },
  { id: '3', nome: 'Pintor', icone: 'Paintbrush', cor: '#10b981' },
  { id: '4', nome: 'Pedreiro', icone: 'Hammer', cor: '#8b5cf6' },
  { id: '5', nome: 'Faxina', icone: 'Home', cor: '#ec4899' },
  { id: '6', nome: 'Jardineiro', icone: 'Wrench', cor: '#22c55e' },
  { id: '7', nome: 'Mecânico', icone: 'Car', cor: '#ef4444' },
  { id: '8', nome: 'Marceneiro', icone: 'Hammer', cor: '#a16207' }
];

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Zap,
    Droplets,
    Paintbrush,
    Hammer,
    Home,
    Wrench,
    Car
  };
  return icons[iconName] || Wrench;
};

export const ServiceSelectionImproved: React.FC = () => {
  const [servicosSelecionados, setServicosSelecionados] = useState<Set<string>>(new Set());
  const [precos, setPrecos] = useState<{ [key: string]: { min: string; max: string } }>({});

  const toggleServico = (servicoId: string) => {
    const novosServicos = new Set(servicosSelecionados);
    if (novosServicos.has(servicoId)) {
      novosServicos.delete(servicoId);
      // Remove preços quando desseleciona o serviço
      const novosPrecos = { ...precos };
      delete novosPrecos[servicoId];
      setPrecos(novosPrecos);
    } else {
      novosServicos.add(servicoId);
    }
    setServicosSelecionados(novosServicos);
  };

  const updatePreco = (servicoId: string, tipo: 'min' | 'max', valor: string) => {
    setPrecos(prev => ({
      ...prev,
      [servicoId]: {
        ...prev[servicoId],
        [tipo]: valor
      }
    }));
  };

  const salvarServicos = () => {
    if (servicosSelecionados.size === 0) {
      toast.error('Selecione pelo menos um serviço');
      return;
    }

    // Validar preços
    for (const servicoId of servicosSelecionados) {
      const preco = precos[servicoId];
      if (!preco?.min || !preco?.max) {
        const servico = servicosDisponiveis.find(s => s.id === servicoId);
        toast.error(`Informe os preços para ${servico?.nome}`);
        return;
      }
      if (parseFloat(preco.min) > parseFloat(preco.max)) {
        const servico = servicosDisponiveis.find(s => s.id === servicoId);
        toast.error(`Preço mínimo não pode ser maior que o máximo para ${servico?.nome}`);
        return;
      }
    }

    toast.success('Serviços salvos com sucesso!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Configurar Serviços
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {servicosDisponiveis.map((servico) => {
            const IconComponent = getIconComponent(servico.icone);
            const isSelected = servicosSelecionados.has(servico.id);
            
            return (
              <div key={servico.id} className="space-y-3">
                {/* Card do Serviço com Ícone Centralizado */}
                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isSelected 
                      ? 'border-2 shadow-lg' 
                      : 'border hover:shadow-md'
                  }`}
                  style={{ 
                    borderColor: isSelected ? servico.cor : undefined,
                    backgroundColor: isSelected ? `${servico.cor}08` : undefined
                  }}
                  onClick={() => toggleServico(servico.id)}
                >
                  <CardContent className="p-4 text-center">
                    {/* Ícone Centralizado */}
                    <div className="flex justify-center mb-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${servico.cor}20` }}
                      >
                        <IconComponent 
                          className="h-6 w-6" 
                          style={{ color: servico.cor }}
                        />
                      </div>
                    </div>
                    
                    {/* Nome do Serviço */}
                    <h3 className="font-medium text-sm text-gray-900 mb-2">
                      {servico.nome}
                    </h3>
                    
                    {/* Indicador de Seleção */}
                    {isSelected && (
                      <div className="flex justify-center">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: servico.cor }}
                        >
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Campos de Preço (aparecem quando selecionado) */}
                {isSelected && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-600 text-center">
                      Faixa de Preço (R$)
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Mín"
                        className="h-8 text-xs"
                        value={precos[servico.id]?.min || ''}
                        onChange={(e) => updatePreco(servico.id, 'min', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Máx"
                        className="h-8 text-xs"
                        value={precos[servico.id]?.max || ''}
                        onChange={(e) => updatePreco(servico.id, 'max', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Resumo dos Serviços Selecionados */}
        {servicosSelecionados.size > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2">
              Serviços Selecionados ({servicosSelecionados.size})
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from(servicosSelecionados).map(servicoId => {
                const servico = servicosDisponiveis.find(s => s.id === servicoId);
                const preco = precos[servicoId];
                return (
                  <Badge 
                    key={servicoId}
                    variant="secondary"
                    className="text-xs"
                    style={{ 
                      backgroundColor: `${servico?.cor}20`,
                      color: servico?.cor 
                    }}
                  >
                    {servico?.nome}
                    {preco?.min && preco?.max && (
                      <span className="ml-1">
                        (R$ {preco.min} - {preco.max})
                      </span>
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Botão Salvar */}
        <Button 
          onClick={salvarServicos}
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={servicosSelecionados.size === 0}
        >
          Salvar Configurações de Serviços
        </Button>
      </CardContent>
    </Card>
  );
};
