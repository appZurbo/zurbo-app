
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Plus, Clock, MapPin } from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';
import InteractiveCalendarDemo from '@/components/ui/interactive-calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AgendamentoData {
  id?: string;
  titulo: string;
  descricao: string;
  data_agendada: string;
  hora_agendada: string;
  cliente_nome: string;
  endereco: string;
  preco_acordado?: number;
}

const AgendaPrestador = () => {
  const navigate = useNavigate();
  const { profile, isPrestador, loading } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();
  const [agendamentos, setAgendamentos] = useState<AgendamentoData[]>([]);
  const [novoAgendamento, setNovoAgendamento] = useState<AgendamentoData>({
    titulo: '',
    descricao: '',
    data_agendada: '',
    hora_agendada: '',
    cliente_nome: '',
    endereco: '',
    preco_acordado: 0
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!profile || !isPrestador)) {
      navigate('/');
      return;
    }

    if (profile && isPrestador) {
      carregarAgendamentos();
    }
  }, [profile, isPrestador, loading, navigate]);

  const carregarAgendamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('prestador_id', profile?.id)
        .order('data_agendada', { ascending: true });

      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos.",
        variant: "destructive"
      });
    }
  };

  const salvarAgendamento = async () => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .insert({
          ...novoAgendamento,
          prestador_id: profile?.id,
          status: 'agendado'
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso!"
      });

      setDialogOpen(false);
      setNovoAgendamento({
        titulo: '',
        descricao: '',
        data_agendada: '',
        hora_agendada: '',
        cliente_nome: '',
        endereco: '',
        preco_acordado: 0
      });
      carregarAgendamentos();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o agendamento.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p className="text-gray-600">Carregando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-7xl mx-auto p-6'}`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/prestador-dashboard')}
            className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {!isMobile && 'Voltar'}
          </Button>
          <div className="flex-1">
            <h1 className={`font-bold text-gray-900 flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              <Calendar className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
              Minha Agenda
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Gerencie seus agendamentos e compromissos
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                {!isMobile && 'Novo Agendamento'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="titulo">Título do Serviço</Label>
                  <Input
                    id="titulo"
                    value={novoAgendamento.titulo}
                    onChange={(e) => setNovoAgendamento(prev => ({...prev, titulo: e.target.value}))}
                    placeholder="Ex: Instalação elétrica"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cliente">Nome do Cliente</Label>
                  <Input
                    id="cliente"
                    value={novoAgendamento.cliente_nome}
                    onChange={(e) => setNovoAgendamento(prev => ({...prev, cliente_nome: e.target.value}))}
                    placeholder="Nome do cliente"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={novoAgendamento.data_agendada}
                      onChange={(e) => setNovoAgendamento(prev => ({...prev, data_agendada: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hora">Hora</Label>
                    <Input
                      id="hora"
                      type="time"
                      value={novoAgendamento.hora_agendada}
                      onChange={(e) => setNovoAgendamento(prev => ({...prev, hora_agendada: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={novoAgendamento.endereco}
                    onChange={(e) => setNovoAgendamento(prev => ({...prev, endereco: e.target.value}))}
                    placeholder="Endereço completo"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="preco">Preço Acordado (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    value={novoAgendamento.preco_acordado}
                    onChange={(e) => setNovoAgendamento(prev => ({...prev, preco_acordado: parseFloat(e.target.value) || 0}))}
                    placeholder="0.00"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={novoAgendamento.descricao}
                    onChange={(e) => setNovoAgendamento(prev => ({...prev, descricao: e.target.value}))}
                    placeholder="Detalhes do serviço..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvarAgendamento}>
                  Salvar Agendamento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Calendário e Lista de Agendamentos */}
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Calendário */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <InteractiveCalendarDemo />
              </CardContent>
            </Card>
          </div>

          {/* Lista de Próximos Agendamentos */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Próximos Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {agendamentos.length > 0 ? (
                  <div className="space-y-3">
                    {agendamentos.slice(0, 5).map((agendamento) => (
                      <div key={agendamento.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{agendamento.titulo}</h4>
                          <Badge variant="outline" className="text-xs">
                            {new Date(agendamento.data_agendada).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          Cliente: {agendamento.cliente_nome}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {agendamento.hora_agendada}
                        </p>
                        <p className="text-xs text-gray-600">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {agendamento.endereco}
                        </p>
                        {agendamento.preco_acordado && (
                          <p className="text-xs text-green-600 font-medium mt-1">
                            R$ {agendamento.preco_acordado.toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Nenhum agendamento</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaPrestador;
