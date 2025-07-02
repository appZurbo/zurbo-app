import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
export const NovoCompromissoModal = () => {
  const {
    profile
  } = useAuth();
  const {
    toast
  } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_agendada: '',
    hora_agendada: '',
    categoria: '',
    endereco: ''
  });
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    try {
      const {
        error
      } = await supabase.from('agendamentos').insert({
        prestador_id: profile.id,
        titulo: formData.titulo,
        descricao: formData.descricao,
        data_agendada: formData.data_agendada,
        hora_agendada: formData.hora_agendada,
        endereco: formData.endereco,
        status: 'confirmado'
      });
      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Compromisso criado com sucesso!"
      });
      setOpen(false);
      setFormData({
        titulo: '',
        descricao: '',
        data_agendada: '',
        hora_agendada: '',
        categoria: '',
        endereco: ''
      });
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o compromisso.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Novo Compromisso
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" value={formData.titulo} onChange={e => handleInputChange('titulo', e.target.value)} placeholder="Ex: Instalação de ar condicionado" required />
          </div>
          
          <div>
            <Label htmlFor="data">Data</Label>
            <Input id="data" type="date" value={formData.data_agendada} onChange={e => handleInputChange('data_agendada', e.target.value)} required />
          </div>
          
          <div>
            <Label htmlFor="hora">Horário</Label>
            <Input id="hora" type="time" value={formData.hora_agendada} onChange={e => handleInputChange('hora_agendada', e.target.value)} required />
          </div>
          
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" value={formData.endereco} onChange={e => handleInputChange('endereco', e.target.value)} placeholder="Endereço do compromisso" />
          </div>
          
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={formData.descricao} onChange={e => handleInputChange('descricao', e.target.value)} placeholder="Detalhes do compromisso..." rows={3} />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Compromisso'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
};