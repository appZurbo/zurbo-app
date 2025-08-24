
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
    // Temporarily disable cities management - table not in database schema
    console.log('Cidades functionality disabled - table not in database schema');
    setCidades([]);
    toast.error('Funcionalidade de cidades temporariamente indisponível.');
  }, []);

  const handleAdicionarCidade = async () => {
    if (!novaCidade.trim()) {
      toast.error('Por favor, insira um nome para a cidade.');
      return;
    }

    toast.error('Funcionalidade temporariamente indisponível.');
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

    toast.error('Funcionalidade temporariamente indisponível.');
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setCidadeEditada('');
  };

  const handleRemoverCidade = async (id: string) => {
    toast.error('Funcionalidade temporariamente indisponível.');
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
              disabled
            />
            <Button onClick={handleAdicionarCidade} disabled>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </div>

        {loading ? (
          <p>Carregando cidades...</p>
        ) : (
          <div className="space-y-2">
            <div className="text-center py-8 text-gray-500">
              <p>Funcionalidade de cidades temporariamente indisponível.</p>
              <p className="text-sm">A tabela de cidades precisa ser criada no banco de dados.</p>
            </div>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4" disabled>
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
