import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Cidade {
  id: string;
  nome: string;
}

const GerenciadorCidades = () => {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [novaCidade, setNovaCidade] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [cidadeEditada, setCidadeEditada] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCidades();
  }, []);

  const fetchCidades = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cidades')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar cidades:', error);
        toast.error('Erro ao buscar cidades.');
        return;
      }

      setCidades(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarCidade = async () => {
    if (!novaCidade.trim()) {
      toast.error('Por favor, insira um nome para a cidade.');
      return;
    }

    try {
      const { error } = await supabase
        .from('cidades')
        .insert([{ nome: novaCidade.trim() }]);

      if (error) {
        console.error('Erro ao adicionar cidade:', error);
        toast.error('Erro ao adicionar cidade.');
        return;
      }

      toast.success('Cidade adicionada com sucesso!');
      setNovaCidade('');
      fetchCidades();
    } catch (error) {
      console.error('Erro ao adicionar cidade:', error);
      toast.error('Erro ao adicionar cidade.');
    }
  };

  const handleEditarCidade = (cidade: Cidade) => {
    setEditandoId(cidade.id);
    setCidadeEditada(cidade.nome);
  };

  const handleSalvarEdicao = async () => {
    if (!cidadeEditada.trim()) {
      toast.error('Por favor, insira um nome para a cidade.');
      return;
    }

    try {
      const { error } = await supabase
        .from('cidades')
        .update({ nome: cidadeEditada.trim() })
        .eq('id', editandoId);

      if (error) {
        console.error('Erro ao atualizar cidade:', error);
        toast.error('Erro ao atualizar cidade.');
        return;
      }

      toast.success('Cidade atualizada com sucesso!');
      setEditandoId(null);
      setCidadeEditada('');
      fetchCidades();
    } catch (error) {
      console.error('Erro ao atualizar cidade:', error);
      toast.error('Erro ao atualizar cidade.');
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setCidadeEditada('');
  };

  const handleRemoverCidade = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cidades')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover cidade:', error);
        toast.error('Erro ao remover cidade.');
        return;
      }

      toast.success('Cidade removida com sucesso!');
      fetchCidades();
    } catch (error) {
      console.error('Erro ao remover cidade:', error);
      toast.error('Erro ao remover cidade.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Cidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="novaCidade">Nova Cidade</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              id="novaCidade"
              placeholder="Nome da cidade"
              value={novaCidade}
              onChange={(e) => setNovaCidade(e.target.value)}
            />
            <Button onClick={handleAdicionarCidade}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </div>

        {loading ? (
          <p>Carregando cidades...</p>
        ) : (
          <div className="space-y-2">
            {cidades.map((cidade) => (
              <div key={cidade.id} className="flex items-center justify-between">
                {editandoId === cidade.id ? (
                  <div className="flex gap-2 w-full">
                    <Input
                      type="text"
                      value={cidadeEditada}
                      onChange={(e) => setCidadeEditada(e.target.value)}
                    />
                    <Button onClick={handleSalvarEdicao} size="sm">
                      Salvar
                    </Button>
                    <Button variant="ghost" onClick={handleCancelarEdicao} size="sm">
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <>
                    <span>{cidade.nome}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditarCidade(cidade)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoverCidade(cidade.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar em lote
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Cidades em Lote</DialogTitle>
            </DialogHeader>
            <div>
              Em construção...
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GerenciadorCidades;
