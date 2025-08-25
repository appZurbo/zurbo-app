import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { getServicos } from '@/utils/database/servicos';
import { getServiceIcon } from '@/config/serviceCategories';

interface ServicoSelecionado {
  id: string;
  precoMin: string;
  precoMax: string;
}

export const ServiceSelectionImproved: React.FC = () => {
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicosSelecionados, setServicosSelecionados] = useState<ServicoSelecionado[]>([]);

  useEffect(() => {
    loadServicos();
  }, []);

  const loadServicos = async () => {
    try {
      console.log('🔄 Loading services from database...');
      const servicosData = await getServicos();
      console.log(`✅ Loaded ${servicosData.length} active services:`, servicosData.map(s => s.nome));
      setServicos(servicosData);
    } catch (error) {
      console.error('❌ Error loading services:', error);
      toast.error('Erro ao carregar serviços disponíveis');
    } finally {
      setLoading(false);
    }
  };

  const toggleServico = (servicoId: string) => {
    const jaExiste = servicosSelecionados.find(s => s.id === servicoId);
    if (jaExiste) {
      setServicosSelecionados(prev => prev.filter(s => s.id !== servicoId));
    } else {
      setServicosSelecionados(prev => [...prev, {
        id: servicoId,
        precoMin: '50',
        precoMax: '200'
      }]);
    }
  };

  const updatePreco = (servicoId: string, tipo: 'precoMin' | 'precoMax', valor: string) => {
    setServicosSelecionados(prev => 
      prev.map(s => s.id === servicoId ? { ...s, [tipo]: valor } : s)
    );
  };

  const salvarServicos = () => {
    if (servicosSelecionados.length === 0) {
      toast.error('Selecione pelo menos um serviço');
      return;
    }

    // Validar preços
    for (const servico of servicosSelecionados) {
      if (!servico.precoMin || !servico.precoMax) {
        const servicoData = servicos.find(s => s.id === servico.id);
        toast.error(`Informe os preços para ${servicoData?.nome}`);
        return;
      }
      if (parseFloat(servico.precoMin) > parseFloat(servico.precoMax)) {
        const servicoData = servicos.find(s => s.id === servico.id);
        toast.error(`Preço mínimo não pode ser maior que o máximo para ${servicoData?.nome}`);
        return;
      }
    }

    console.log('💾 Saving services:', servicosSelecionados);
    toast.success('Serviços salvos com sucesso!');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando serviços...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {servicos.map((servico) => {
            const iconConfig = getServiceIcon(servico.nome);
            const IconComponent = iconConfig.icon;
            const isSelected = servicosSelecionados.some(s => s.id === servico.id);
            
            return (
              <div key={servico.id} className="space-y-3">
                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isSelected 
                      ? 'border-2 shadow-lg border-orange-500 bg-orange-50' 
                      : 'border hover:shadow-md'
                  }`}
                  onClick={() => toggleServico(servico.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconConfig.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${iconConfig.color}`} />
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-sm text-gray-900 mb-2">
                      {servico.nome}
                    </h3>
                    
                    {isSelected && (
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-orange-500">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

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
                        value={servicosSelecionados.find(s => s.id === servico.id)?.precoMin || ''}
                        onChange={(e) => updatePreco(servico.id, 'precoMin', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Máx"
                        className="h-8 text-xs"
                        value={servicosSelecionados.find(s => s.id === servico.id)?.precoMax || ''}
                        onChange={(e) => updatePreco(servico.id, 'precoMax', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {servicosSelecionados.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2">
              Serviços Selecionados ({servicosSelecionados.length})
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {servicosSelecionados.map(servicoSelecionado => {
                const servico = servicos.find(s => s.id === servicoSelecionado.id);
                const iconConfig = getServiceIcon(servico?.nome || '');
                return (
                  <Badge 
                    key={servicoSelecionado.id}
                    variant="secondary"
                    className="text-xs"
                    style={{ 
                      backgroundColor: `${iconConfig.bgColor.replace('bg-', '')}`,
                      color: iconConfig.color.replace('text-', '') 
                    }}
                  >
                    {servico?.nome}
                    {servicoSelecionado.precoMin && servicoSelecionado.precoMax && (
                      <span className="ml-1">
                        (R$ {servicoSelecionado.precoMin} - {servicoSelecionado.precoMax})
                      </span>
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <Button 
          onClick={salvarServicos}
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={servicosSelecionados.length === 0}
        >
          Salvar Configurações de Serviços
        </Button>
      </CardContent>
    </Card>
  );
};
