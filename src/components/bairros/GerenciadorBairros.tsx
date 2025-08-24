
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Bairro {
  id: string;
  nome: string;
  cidade_id: string;
  criado_em: string;
}

interface GerenciadorBairrosProps {
  cidadeId: string;
}

export const GerenciadorBairros: React.FC<GerenciadorBairrosProps> = ({ cidadeId }) => {
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [nomeBairro, setNomeBairro] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedBairro, setSelectedBairro] = useState<Bairro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBairros();
  }, [cidadeId]);

  const loadBairros = async () => {
    setLoading(true);
    try {
      // TODO: Implement bairros table in database
      // For now, we'll use mock data or disable this functionality
      console.log('Bairros functionality disabled - table not in database schema');
      setBairros([]);
      toast.error('Funcionalidade de bairros temporariamente indisponível.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBairro = async () => {
    if (!nomeBairro.trim()) {
      toast.error('Nome do bairro é obrigatório.');
      return;
    }

    try {
      // TODO: Implement bairros table in database
      toast.error('Funcionalidade temporariamente indisponível.');
    } catch (error) {
      toast.error('Erro ao criar bairro.');
    }
  };

  const handleUpdateBairro = async () => {
    if (!selectedBairro) return;

    try {
      // TODO: Implement bairros table in database
      toast.error('Funcionalidade temporariamente indisponível.');
    } catch (error) {
      toast.error('Erro ao atualizar bairro.');
    }
  };

  const handleDeleteBairro = async (bairroId: string) => {
    try {
      // TODO: Implement bairros table in database
      toast.error('Funcionalidade temporariamente indisponível.');
    } catch (error) {
      toast.error('Erro ao excluir bairro.');
    }
  };

  const handleOpenEditModal = (bairro: Bairro) => {
    setSelectedBairro(bairro);
    setNomeBairro(bairro.nome);
    setOpenModal(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Bairros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
              <Button onClick={() => { setSelectedBairro(null); setNomeBairro(''); setOpenModal(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Bairro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedBairro ? 'Editar Bairro' : 'Adicionar Bairro'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="nome"
                    value={nomeBairro}
                    onChange={(e) => setNomeBairro(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={selectedBairro ? handleUpdateBairro : handleCreateBairro}>
                {selectedBairro ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p>Carregando bairros...</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {bairros.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Funcionalidade de bairros temporariamente indisponível.</p>
                <p className="text-sm">A tabela de bairros precisa ser criada no banco de dados.</p>
              </div>
            ) : (
              bairros.map((bairro) => (
                <div key={bairro.id} className="py-2 flex items-center justify-between">
                  <span>{bairro.nome}</span>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditModal(bairro)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteBairro(bairro.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
