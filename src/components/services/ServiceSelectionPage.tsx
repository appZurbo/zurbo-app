import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, Star, DollarSign, Sparkles, Flower, Paintbrush, Zap, Droplets, Truck, ChefHat, Hammer, Scissors, Heart } from 'lucide-react';
interface Servico {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  ativo: boolean;
}
interface ServicoSelecionado {
  servico_id: string;
  preco_min: number;
  preco_max: number;
}
interface ServiceSelectionPageProps {
  onComplete: () => void;
}
const iconMap: {
  [key: string]: any;
} = {
  Sparkles,
  Flower,
  Paintbrush,
  Zap,
  Droplets,
  Truck,
  ChefHat,
  Hammer,
  Scissors,
  Heart
};
const ServiceSelectionPage = ({
  onComplete
}: ServiceSelectionPageProps) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<ServicoSelecionado[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const {
    toast
  } = useToast();
  const {
    profile
  } = useAuth();
  useEffect(() => {
    loadServicos();
    loadServicosPrestador();
  }, []);
  const loadServicos = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('servicos').select('*').eq('ativo', true).order('nome');
      if (error) throw error;
      setServicos(data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os serviços disponíveis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const loadServicosPrestador = async () => {
    if (!profile) return;
    try {
      const {
        data,
        error
      } = await supabase.from('prestador_servicos').select('servico_id, preco_min, preco_max').eq('prestador_id', profile.id);
      if (error) throw error;
      const servicosExistentes = (data || []).map(item => ({
        servico_id: item.servico_id,
        preco_min: item.preco_min || 0,
        preco_max: item.preco_max || 0
      }));
      setServicosSelecionados(servicosExistentes);
    } catch (error) {
      console.error('Erro ao carregar serviços do prestador:', error);
    }
  };
  const toggleServico = (servicoId: string) => {
    const jaExiste = servicosSelecionados.find(s => s.servico_id === servicoId);
    if (jaExiste) {
      setServicosSelecionados(prev => prev.filter(s => s.servico_id !== servicoId));
    } else {
      setServicosSelecionados(prev => [...prev, {
        servico_id: servicoId,
        preco_min: 50,
        preco_max: 200
      }]);
    }
  };
  const updatePreco = (servicoId: string, field: 'preco_min' | 'preco_max', value: number) => {
    setServicosSelecionados(prev => prev.map(s => s.servico_id === servicoId ? {
      ...s,
      [field]: value
    } : s));
  };
  const salvarServicos = async () => {
    if (!profile) {
      toast({
        title: "Erro",
        description: "Perfil não encontrado",
        variant: "destructive"
      });
      return;
    }
    if (servicosSelecionados.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um serviço para continuar",
        variant: "destructive"
      });
      return;
    }
    setSaving(true);
    try {
      // Primeiro, remover todos os serviços existentes
      await supabase.from('prestador_servicos').delete().eq('prestador_id', profile.id);

      // Depois, inserir os novos serviços
      const servicosParaInserir = servicosSelecionados.map(s => ({
        prestador_id: profile.id,
        servico_id: s.servico_id,
        preco_min: s.preco_min,
        preco_max: s.preco_max
      }));
      const {
        error
      } = await supabase.from('prestador_servicos').insert(servicosParaInserir);
      if (error) throw error;
      toast({
        title: "Sucesso!",
        description: "Seus serviços foram salvos com sucesso"
      });
      onComplete();
    } catch (error: any) {
      console.error('Erro ao salvar serviços:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os serviços",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p>Carregando serviços...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 py-0">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Star className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configure seus Serviços
          </h1>
          <p className="text-gray-600 max-w-2xl px-0 mx-0">
            Selecione os serviços que você oferece e defina seus preços. 
            Isso ajudará os clientes a encontrarem você mais facilmente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {servicos.map(servico => {
          const isSelected = servicosSelecionados.some(s => s.servico_id === servico.id);
          const IconComponent = iconMap[servico.icone] || Star;
          return <Card key={servico.id} className={`cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:shadow-md'}`} onClick={() => toggleServico(servico.id)}>
                <CardContent className="p-4 px-0 py-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                  backgroundColor: `${servico.cor}20`
                }}>
                      <IconComponent className="h-5 w-5" style={{
                    color: servico.cor
                  }} />
                    </div>
                    {isSelected && <CheckCircle className="h-6 w-6 text-orange-500" />}
                  </div>
                  <h3 className="font-medium text-gray-900">
                    {servico.nome}
                  </h3>
                </CardContent>
              </Card>;
        })}
        </div>

        {servicosSelecionados.length > 0 && <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Defina seus Preços
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {servicosSelecionados.map(servicoSelecionado => {
            const servico = servicos.find(s => s.id === servicoSelecionado.servico_id);
            if (!servico) return null;
            return <div key={servico.id} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      {servico.nome}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`min-${servico.id}`}>
                          Preço Mínimo (R$)
                        </Label>
                        <Input id={`min-${servico.id}`} type="number" min="0" step="0.01" value={servicoSelecionado.preco_min} onChange={e => updatePreco(servico.id, 'preco_min', parseFloat(e.target.value) || 0)} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor={`max-${servico.id}`}>
                          Preço Máximo (R$)
                        </Label>
                        <Input id={`max-${servico.id}`} type="number" min="0" step="0.01" value={servicoSelecionado.preco_max} onChange={e => updatePreco(servico.id, 'preco_max', parseFloat(e.target.value) || 0)} className="mt-1" />
                      </div>
                    </div>
                  </div>;
          })}
            </CardContent>
          </Card>}

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onComplete} disabled={saving}>
            Pular por Agora
          </Button>
          <Button onClick={salvarServicos} disabled={saving || servicosSelecionados.length === 0} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            {saving ? 'Salvando...' : 'Salvar e Continuar'}
          </Button>
        </div>
      </div>
    </div>;
};
export default ServiceSelectionPage;