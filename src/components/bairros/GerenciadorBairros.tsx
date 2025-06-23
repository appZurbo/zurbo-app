
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  listarBairrosAtendidos, 
  adicionarBairroAtendido, 
  removerBairroAtendido,
  BAIRROS_SINOP,
  type BairroAtendido 
} from '@/utils/database/bairros';

const GerenciadorBairros = () => {
  const [bairrosAtendidos, setBairrosAtendidos] = useState<BairroAtendido[]>([]);
  const [bairroSelecionado, setBairroSelecionado] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarBairros();
  }, []);

  const carregarBairros = async () => {
    try {
      const bairros = await listarBairrosAtendidos();
      setBairrosAtendidos(bairros);
    } catch (error) {
      console.error('Erro ao carregar bairros:', error);
    }
  };

  const handleAdicionarBairro = async () => {
    if (!bairroSelecionado) return;

    setLoading(true);
    try {
      const sucesso = await adicionarBairroAtendido(bairroSelecionado);
      if (sucesso) {
        await carregarBairros();
        setBairroSelecionado('');
        toast({
          title: "Bairro adicionado",
          description: `${bairroSelecionado} foi adicionado aos seus bairros atendidos`,
        });
      } else {
        throw new Error('Falha ao adicionar bairro');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar bairro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverBairro = async (bairroId: string, nomeBairro: string) => {
    try {
      const sucesso = await removerBairroAtendido(bairroId);
      if (sucesso) {
        setBairrosAtendidos(prev => prev.filter(b => b.id !== bairroId));
        toast({
          title: "Bairro removido",
          description: `${nomeBairro} foi removido dos seus bairros atendidos`,
        });
      } else {
        throw new Error('Falha ao remover bairro');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover bairro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const bairrosDisponiveis = BAIRROS_SINOP.filter(
    bairro => !bairrosAtendidos.some(ba => ba.bairro === bairro)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Bairros Atendidos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adicionar novo bairro */}
        <div className="flex gap-2">
          <Select
            value={bairroSelecionado}
            onValueChange={setBairroSelecionado}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione um bairro para adicionar" />
            </SelectTrigger>
            <SelectContent>
              {bairrosDisponiveis.map((bairro) => (
                <SelectItem key={bairro} value={bairro}>
                  {bairro}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAdicionarBairro}
            disabled={!bairroSelecionado || loading}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Lista de bairros atendidos */}
        {bairrosAtendidos.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Seus bairros atendidos ({bairrosAtendidos.length})
            </h4>
            <div className="space-y-2">
              {bairrosAtendidos.map((bairro) => (
                <div 
                  key={bairro.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <Badge variant="secondary">
                    {bairro.bairro}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoverBairro(bairro.id, bairro.bairro)}
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
            <p className="text-gray-500">Nenhum bairro adicionado ainda</p>
            <p className="text-sm text-gray-400">
              Adicione os bairros onde você atende para aparecer nas buscas
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          💡 Dica: Adicione os bairros onde você oferece seus serviços para ser encontrado mais facilmente pelos clientes da região.
        </div>
      </CardContent>
    </Card>
  );
};

export default GerenciadorBairros;
