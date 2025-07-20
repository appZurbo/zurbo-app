
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface CidadeAtendida {
  id: string;
  prestador_id: string;
  cidade: string;
}

export const CIDADES_REGIAO = [
  'Sinop, Mato Grosso',
  'Sorriso, Mato Grosso',
  'Lucas do Rio Verde, Mato Grosso',
  'Nova Mutum, Mato Grosso',
  'Vera, Mato Grosso',
  'Itanhangá, Mato Grosso'
];

const GerenciadorCidades = () => {
  const [cidadesAtendidas, setCidadesAtendidas] = useState<CidadeAtendida[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarCidades();
  }, []);

  const carregarCidades = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.user.id)
        .single();

      if (!profile) return;

      // Usar bairros_atendidos como fallback temporariamente
      const { data, error } = await supabase
        .from('bairros_atendidos')
        .select('*')
        .eq('prestador_id', profile.id);

      if (error) {
        console.error('Erro ao carregar cidades:', error);
        return;
      }

      // Mapear bairros para cidades temporariamente
      const cidadesMapeadas = (data || []).map(item => ({
        id: item.id,
        prestador_id: item.prestador_id,
        cidade: item.bairro // Usar bairro como cidade temporariamente
      }));
      setCidadesAtendidas(cidadesMapeadas);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  };

  const handleAdicionarCidade = async () => {
    if (!cidadeSelecionada) return;

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.user.id)
        .single();

      if (!profile) return;

      const { error } = await supabase
        .from('bairros_atendidos')
        .insert({
          prestador_id: profile.id,
          bairro: cidadeSelecionada
        });

      if (error) throw error;

      await carregarCidades();
      setCidadeSelecionada('');
      toast({
        title: "Cidade adicionada",
        description: `${cidadeSelecionada} foi adicionada às suas cidades atendidas`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar cidade. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverCidade = async (cidadeId: string, nomeCidade: string) => {
    try {
      const { error } = await supabase
        .from('bairros_atendidos')
        .delete()
        .eq('id', cidadeId);

      if (error) throw error;

      setCidadesAtendidas(prev => prev.filter(c => c.id !== cidadeId));
      toast({
        title: "Cidade removida",
        description: `${nomeCidade} foi removida das suas cidades atendidas`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover cidade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const cidadesDisponiveis = CIDADES_REGIAO.filter(
    cidade => !cidadesAtendidas.some(ca => ca.cidade === cidade)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Áreas de Atendimento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adicionar nova cidade */}
        <div className="flex gap-2">
          <Select
            value={cidadeSelecionada}
            onValueChange={setCidadeSelecionada}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione uma cidade para adicionar" />
            </SelectTrigger>
            <SelectContent>
              {cidadesDisponiveis.map((cidade) => (
                <SelectItem key={cidade} value={cidade}>
                  {cidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAdicionarCidade}
            disabled={!cidadeSelecionada || loading}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Lista de cidades atendidas */}
        {cidadesAtendidas.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Suas áreas de atendimento ({cidadesAtendidas.length})
            </h4>
            <div className="space-y-2">
              {cidadesAtendidas.map((cidade) => (
                <div 
                  key={cidade.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <Badge variant="secondary">
                    {cidade.cidade}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoverCidade(cidade.id, cidade.cidade)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Nenhuma cidade adicionada ainda</p>
            <p className="text-sm text-gray-400">
              Adicione as cidades onde você atende para aparecer nas buscas
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          💡 Dica: Adicione as cidades onde você oferece seus serviços para ser encontrado mais facilmente pelos clientes da região.
        </div>
      </CardContent>
    </Card>
  );
};

export default GerenciadorCidades;
