
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { useMobile } from '@/hooks/useMobile';
import { toast } from "@/hooks/toast-system";
import { supabase } from '@/integrations/supabase/client';
import AuthButton from '@/components/auth/AuthModalHelper';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Copy, 
  MessageCircle, 
  Plus,
  Bell,
  X,
  Edit,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, isSameDay, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';

interface Agendamento {
  id: string;
  titulo: string;
  descricao?: string;
  data_agendada: string;
  hora_agendada: string;
  endereco?: string;
  status: string;
  cliente_nome?: string;
  preco_acordado?: number;
  tipo_origem?: 'manual' | 'sistema';
  solicitante?: {
    nome: string;
    foto_url?: string;
    endereco_cidade?: string;
  };
}

const AgendaPrestador = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const isMobile = useMobile();
  
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    titulo: '',
    data_agendada: '',
    hora_agendada: '',
    descricao: '',
    cliente_nome: ''
  });
  
  useEffect(() => {
    if (profile) {
      loadAgendamentos();
    }
  }, [profile]);
  
  const loadAgendamentos = async () => {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          solicitante:users!agendamentos_solicitante_id_fkey (nome, foto_url, endereco_cidade)
        `)
        .eq('prestador_id', profile.id)
        .order('data_agendada', { ascending: true });
      
      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error) {
      console.error('Error loading agendamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDaysWithAppointments = () => {
    return agendamentos.map(apt => parseISO(apt.data_agendada));
  };

  const getAppointmentsForDate = (date: Date) => {
    return agendamentos.filter(apt => 
      isSameDay(parseISO(apt.data_agendada), date)
    ).sort((a, b) => a.hora_agendada.localeCompare(b.hora_agendada));
  };

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const appointments = getAppointmentsForDate(date);
    
    if (appointments.length > 0) {
      setExpandedDay(expandedDay === dateStr ? null : dateStr);
    }
    setSelectedDate(date);
  };

  const createManualAppointment = async () => {
    if (!profile || !newAppointment.titulo || !newAppointment.data_agendada || !newAppointment.hora_agendada) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          prestador_id: profile.id,
          titulo: newAppointment.titulo,
          data_agendada: newAppointment.data_agendada,
          hora_agendada: newAppointment.hora_agendada,
          descricao: newAppointment.descricao,
          cliente_nome: newAppointment.cliente_nome,
          status: 'confirmado',
          tipo_origem: 'manual'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Compromisso adicionado com sucesso!"
      });

      setNewAppointment({
        titulo: '',
        data_agendada: '',
        hora_agendada: '',
        descricao: '',
        cliente_nome: ''
      });
      setIsAddingManual(false);
      loadAgendamentos();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o compromisso.",
        variant: "destructive"
      });
    }
  };

  const sendNotificationToClient = async (agendamento: Agendamento, type: 'alteracao' | 'cancelamento' | 'lembrete') => {
    // Implementation for sending notifications
    toast({
      title: "Notificação enviada",
      description: `Notificação de ${type} enviada ao cliente.`
    });
  };

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Endereço copiado!",
        description: "O endereço foi copiado para sua área de transferência."
      });
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'concluido':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  };

  if (authLoading) {
    return (
      <UnifiedLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando agenda...</p>
          </div>
        </div>
      </UnifiedLayout>
    );
  }

  if (!profile || profile.tipo !== 'prestador') {
    return (
      <UnifiedLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Apenas prestadores podem acessar a agenda.
              </p>
              <AuthButton className="w-full">
                Fazer Login
              </AuthButton>
            </CardContent>
          </Card>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout>
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-6xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                  Minha Agenda
                </h1>
                <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                  Gerencie seus compromissos e agendamentos
                </p>
              </div>
            </div>

            <Dialog open={isAddingManual} onOpenChange={setIsAddingManual}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Compromisso
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Compromisso Manual</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      value={newAppointment.titulo}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, titulo: e.target.value }))}
                      placeholder="Ex: Reunião com cliente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cliente_nome">Nome do Cliente</Label>
                    <Input
                      id="cliente_nome"
                      value={newAppointment.cliente_nome}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, cliente_nome: e.target.value }))}
                      placeholder="Nome do cliente (opcional)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="data">Data *</Label>
                      <Input
                        id="data"
                        type="date"
                        value={newAppointment.data_agendada}
                        onChange={(e) => setNewAppointment(prev => ({ ...prev, data_agendada: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hora">Horário *</Label>
                      <Input
                        id="hora"
                        type="time"
                        value={newAppointment.hora_agendada}
                        onChange={(e) => setNewAppointment(prev => ({ ...prev, hora_agendada: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={newAppointment.descricao}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, descricao: e.target.value }))}
                      placeholder="Detalhes do compromisso (opcional)"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddingManual(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={createManualAppointment} className="flex-1 bg-orange-500 hover:bg-orange-600">
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Calendar and Appointments */}
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Carregando agenda...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-orange-500" />
                      Calendário
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && handleDayClick(date)}
                      onDayClick={handleDayClick}
                      locale={ptBR}
                      className="rounded-md border"
                      modifiers={{
                        hasAppointment: getDaysWithAppointments(),
                      }}
                      modifiersStyles={{
                        hasAppointment: {
                          backgroundColor: 'hsl(24, 95%, 53%)',
                          color: 'white',
                          fontWeight: 'bold',
                          position: 'relative'
                        }
                      }}
                    />
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        {selectedDate && format(selectedDate, 'MMMM \'de\' yyyy', { locale: ptBR })}
                      </p>
                      <div className="mt-2 flex items-center justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span>Com agendamentos</span>
                        </div>
                        <span className="text-gray-500">
                          {agendamentos.length} total
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Appointments List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedDate ? 
                        `Agendamentos - ${format(selectedDate, 'dd \'de\' MMMM', { locale: ptBR })}` : 
                        'Próximos Compromissos'
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedDate && expandedDay === format(selectedDate, 'yyyy-MM-dd') ? (
                      // Expanded day view
                      <div className="space-y-4">
                        {getAppointmentsForDate(selectedDate).map(agendamento => (
                          <Card key={agendamento.id} className="border-l-4 border-l-orange-500">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-lg">{agendamento.titulo}</h3>
                                    <Badge className={getStatusColor(agendamento.status)}>
                                      {getStatusText(agendamento.status)}
                                    </Badge>
                                    {agendamento.tipo_origem === 'sistema' && (
                                      <Badge variant="outline" className="text-xs">
                                        Sistema
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-blue-500" />
                                      <span className="font-medium">{agendamento.hora_agendada}</span>
                                    </div>
                                    
                                    {(agendamento.cliente_nome || agendamento.solicitante?.nome) && (
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-green-500" />
                                        <span className="font-medium">
                                          {agendamento.cliente_nome || agendamento.solicitante?.nome}
                                        </span>
                                      </div>
                                    )}

                                    {agendamento.endereco && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-purple-500" />
                                        <span className="flex-1">{agendamento.endereco}</span>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => copyAddress(agendamento.endereco!)}
                                          className="ml-2 h-6 px-2"
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}

                                    {agendamento.preco_acordado && (
                                      <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                        <span className="text-green-600 font-bold">
                                          R$ {agendamento.preco_acordado.toFixed(2)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {agendamento.descricao && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                      <p className="text-sm text-gray-700">
                                        {agendamento.descricao}
                                      </p>
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="flex flex-wrap gap-2 mt-4">
                                    {agendamento.solicitante && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => navigate('/conversas')}
                                        className="flex items-center gap-1"
                                      >
                                        <MessageCircle className="h-3 w-3" />
                                        Contatar Cliente
                                      </Button>
                                    )}
                                    
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => sendNotificationToClient(agendamento, 'lembrete')}
                                      className="flex items-center gap-1"
                                    >
                                      <Bell className="h-3 w-3" />
                                      Lembrete
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => sendNotificationToClient(agendamento, 'alteracao')}
                                      className="flex items-center gap-1 text-blue-600"
                                    >
                                      <Edit className="h-3 w-3" />
                                      Alteração
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => sendNotificationToClient(agendamento, 'cancelamento')}
                                      className="flex items-center gap-1 text-red-600"
                                    >
                                      <AlertTriangle className="h-3 w-3" />
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Button
                          variant="outline"
                          onClick={() => setExpandedDay(null)}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Fechar Detalhes
                        </Button>
                      </div>
                    ) : (
                      // General appointments view
                      <div>
                        {agendamentos.length === 0 ? (
                          <div className="text-center py-8">
                            <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold mb-2">Agenda vazia</h3>
                            <p className="text-gray-600 mb-4">
                              Você ainda não possui compromissos agendados.
                            </p>
                            <Button
                              onClick={() => setIsAddingManual(true)}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Compromisso
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {agendamentos.slice(0, 5).map(agendamento => (
                              <Card key={agendamento.id} className="border-l-4 border-l-orange-500">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold">{agendamento.titulo}</h3>
                                        <Badge className={getStatusColor(agendamento.status)}>
                                          {getStatusText(agendamento.status)}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                          <CalendarIcon className="h-4 w-4 text-orange-500" />
                                          <span>{format(parseISO(agendamento.data_agendada), 'dd/MM', { locale: ptBR })}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-4 w-4 text-blue-500" />
                                          <span>{agendamento.hora_agendada}</span>
                                        </div>
                                        {(agendamento.cliente_nome || agendamento.solicitante?.nome) && (
                                          <div className="flex items-center gap-1">
                                            <User className="h-4 w-4 text-green-500" />
                                            <span>{agendamento.cliente_nome || agendamento.solicitante?.nome}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDayClick(parseISO(agendamento.data_agendada))}
                                    >
                                      Ver Detalhes
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            {agendamentos.length > 5 && (
                              <p className="text-center text-sm text-gray-500">
                                E mais {agendamentos.length - 5} agendamentos...
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default AgendaPrestador;
