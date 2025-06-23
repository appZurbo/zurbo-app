
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { criarAgendamento } from '@/utils/database/agendamentos';

interface ModalAgendamentoProps {
  prestadorId: string;
  prestadorNome: string;
  servicos: Array<{
    id: string;
    nome: string;
    icone?: string;
  }>;
  trigger: React.ReactNode;
}

const ModalAgendamento = ({ 
  prestadorId, 
  prestadorNome, 
  servicos, 
  trigger 
}: ModalAgendamentoProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    servicoId: '',
    dataAgendada: '',
    horaAgendada: ''
  });
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const horariosDisponiveis = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para agendar serviços",
        variant: "destructive",
      });
      return;
    }

    if (!formData.servicoId || !formData.dataAgendada || !formData.horaAgendada) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const agendamento = await criarAgendamento({
        prestadorId,
        servicoId: formData.servicoId,
        dataAgendada: formData.dataAgendada,
        horaAgendada: formData.horaAgendada
      });

      if (agendamento) {
        toast({
          title: "Agendamento criado!",
          description: `Solicitação enviada para ${prestadorNome}`,
        });
        setOpen(false);
        setFormData({
          servicoId: '',
          dataAgendada: '',
          horaAgendada: ''
        });
      } else {
        throw new Error('Falha ao criar agendamento');
      }
    } catch (error) {
      toast({
        title: "Erro ao agendar",
        description: "Erro ao criar agendamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Data mínima é hoje
  const hoje = new Date().toISOString().split('T')[0];
  
  // Data máxima é 30 dias no futuro
  const dataMaxima = new Date();
  dataMaxima.setDate(dataMaxima.getDate() + 30);
  const maxDate = dataMaxima.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendar Serviço
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="prestador">Prestador</Label>
            <Input
              id="prestador"
              value={prestadorNome}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="servico">Serviço *</Label>
            <Select
              value={formData.servicoId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, servicoId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {servicos.map((servico) => (
                  <SelectItem key={servico.id} value={servico.id}>
                    {servico.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="data">Data *</Label>
            <Input
              id="data"
              type="date"
              min={hoje}
              max={maxDate}
              value={formData.dataAgendada}
              onChange={(e) => setFormData(prev => ({ ...prev, dataAgendada: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="hora">Horário *</Label>
            <Select
              value={formData.horaAgendada}
              onValueChange={(value) => setFormData(prev => ({ ...prev, horaAgendada: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                {horariosDisponiveis.map((horario) => (
                  <SelectItem key={horario} value={horario}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {horario}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Agendando...' : 'Agendar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAgendamento;
