
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { useMobile } from '@/hooks/useMobile';
import { useToast } from '@/hooks/use-toast';
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
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { CaptionLabel, CaptionNavigation, useDayPicker } from 'react-day-picker';
import type { CaptionProps } from 'react-day-picker';

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
  solicitante_id?: string | null;
  solicitante?: {
    nome: string;
    foto_url?: string;
    endereco_cidade?: string;
  };
}

/** Caption do calendário com botão "Hoje" à direita da data do mês. */
function CaptionComHoje(props: CaptionProps & { onGoToToday: () => void }) {
  const { onGoToToday, id, displayMonth, displayIndex, ...rest } = props;
  const { classNames } = useDayPicker();
  return (
    <div className={classNames.caption} {...rest}>
      <CaptionLabel id={id} displayMonth={displayMonth} displayIndex={displayIndex} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onGoToToday}
        className="absolute right-10 h-7 px-2 text-xs text-muted-foreground hover:text-orange-500 transition-none"
      >
        Hoje
      </Button>
      <CaptionNavigation displayMonth={displayMonth} id={id} />
    </div>
  );
}

/** Horas para agendamento manual (00–23). */
const HORAS_AGENDAMENTO = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
/** Minutos para agendamento manual (00–59). */
const MINUTOS_AGENDAMENTO = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const ITEM_HEIGHT_PX = 32;
const HOUR_BLOCK_HEIGHT = HORAS_AGENDAMENTO.length * ITEM_HEIGHT_PX;
const MIN_BLOCK_HEIGHT = MINUTOS_AGENDAMENTO.length * ITEM_HEIGHT_PX;

/** Colunas de hora/minuto com scroll infinito (sem barra visível). */
function TimePickerColumns({
  horaAtual,
  minutoAtual,
  setHora,
  setMinuto,
}: {
  horaAtual: string;
  minutoAtual: string;
  setHora: (h: string) => void;
  setMinuto: (m: string) => void;
}) {
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const scrollbarHide = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

  useEffect(() => {
    const h = hourRef.current;
    const m = minRef.current;
    if (!h || !m) return;
    h.scrollTop = HOUR_BLOCK_HEIGHT;
    m.scrollTop = MIN_BLOCK_HEIGHT;
    const onHourScroll = () => {
      const st = h.scrollTop;
      if (st < HOUR_BLOCK_HEIGHT * 0.5) h.scrollTop = st + HOUR_BLOCK_HEIGHT;
      else if (st > HOUR_BLOCK_HEIGHT * 2.5) h.scrollTop = st - HOUR_BLOCK_HEIGHT;
    };
    const onMinScroll = () => {
      const st = m.scrollTop;
      if (st < MIN_BLOCK_HEIGHT * 0.5) m.scrollTop = st + MIN_BLOCK_HEIGHT;
      else if (st > MIN_BLOCK_HEIGHT * 2.5) m.scrollTop = st - MIN_BLOCK_HEIGHT;
    };
    h.addEventListener('scroll', onHourScroll, { passive: true });
    m.addEventListener('scroll', onMinScroll, { passive: true });
    return () => {
      h.removeEventListener('scroll', onHourScroll);
      m.removeEventListener('scroll', onMinScroll);
    };
  }, []);

  const horasTriplas = [...HORAS_AGENDAMENTO, ...HORAS_AGENDAMENTO, ...HORAS_AGENDAMENTO];
  const minutosTriplas = [...MINUTOS_AGENDAMENTO, ...MINUTOS_AGENDAMENTO, ...MINUTOS_AGENDAMENTO];

  return (
    <div className="flex">
      <div
        ref={hourRef}
        className={cn(
          'w-11 shrink-0 overflow-y-auto max-h-48 border-r border-orange-400 touch-pan-y',
          scrollbarHide
        )}
      >
        {horasTriplas.map((h, i) => {
          const sel = horaAtual === h;
          return (
            <button
              key={`h-${i}-${h}`}
              type="button"
              className={cn(
                'w-full text-center text-sm transition-none flex items-center justify-center',
                sel ? 'bg-orange-500 text-white font-medium' : 'hover:bg-orange-500/80 hover:text-white'
              )}
              style={{ height: ITEM_HEIGHT_PX }}
              onClick={() => setHora(h)}
            >
              {h}
            </button>
          );
        })}
      </div>
      <div
        ref={minRef}
        className={cn('w-11 shrink-0 overflow-y-auto max-h-48 touch-pan-y', scrollbarHide)}
      >
        {minutosTriplas.map((m, i) => {
          const sel = minutoAtual === m;
          return (
            <button
              key={`m-${i}-${m}`}
              type="button"
              className={cn(
                'w-full text-center text-sm transition-none flex items-center justify-center',
                sel ? 'bg-orange-500 text-white font-medium' : 'hover:bg-orange-500/80 hover:text-white'
              )}
              style={{ height: ITEM_HEIGHT_PX }}
              onClick={() => setMinuto(m)}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const AgendaPrestador = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const isMobile = useMobile();
  const { toast } = useToast();
  
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [displayMonth, setDisplayMonth] = useState<Date>(() => new Date());
  const [expandedAppointmentIds, setExpandedAppointmentIds] = useState<string[]>([]);

  const handleGoToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setDisplayMonth(today);
  };
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [pickerContainer, setPickerContainer] = useState<HTMLElement | null>(null);
  const [modalCalendarMonth, setModalCalendarMonth] = useState(() => new Date());
  const [newAppointment, setNewAppointment] = useState({
    titulo: '',
    data_agendada: '',
    hora_agendada: '',
    descricao: '',
    cliente_nome: '',
    endereco: '',
    preco_acordado: ''
  });
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  
  useEffect(() => {
    if (profile) {
      loadAgendamentos();
    }
  }, [profile]);

  useEffect(() => {
    if (datePickerOpen) {
      setModalCalendarMonth(
        newAppointment.data_agendada ? parseISO(newAppointment.data_agendada) : new Date()
      );
    }
  }, [datePickerOpen, newAppointment.data_agendada]);
  
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
      const rows = (data || []) as (Agendamento & { manually_added?: boolean; prestador_id?: string; solicitante_id?: string | null })[];
      setAgendamentos(rows.map(a => ({
        ...a,
        tipo_origem: (a.manually_added === true || (a.prestador_id && a.solicitante_id && a.solicitante_id === a.prestador_id)) ? 'manual' : 'sistema'
      })));
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
    setSelectedDate(date);
    setExpandedAppointmentIds([]);
  };

  const handleAppointmentClick = (agendamento: Agendamento) => {
    setExpandedAppointmentIds(prev =>
      prev.includes(agendamento.id) ? prev.filter(id => id !== agendamento.id) : [...prev, agendamento.id]
    );
  };

  const closeAppointment = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedAppointmentIds(prev => prev.filter(x => x !== id));
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
      const horaParaDb = newAppointment.hora_agendada.length === 5
        ? `${newAppointment.hora_agendada}:00`
        : newAppointment.hora_agendada;

      const precoNum = newAppointment.preco_acordado.trim() !== ''
        ? parseFloat(String(newAppointment.preco_acordado).replace(',', '.'))
        : null;

      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          prestador_id: profile.id,
          solicitante_id: profile.id,
          titulo: newAppointment.titulo,
          data_agendada: newAppointment.data_agendada,
          hora_agendada: horaParaDb,
          descricao: newAppointment.descricao ?? null,
          cliente_nome: newAppointment.cliente_nome || null,
          endereco: newAppointment.endereco.trim() || null,
          preco_acordado: precoNum != null && !Number.isNaN(precoNum) ? precoNum : null,
          status: 'confirmado'
        })
        .select()
        .single();

      if (error) throw error;

      const novoComoAgendamento: Agendamento = {
        ...data,
        solicitante: undefined,
        tipo_origem: 'manual'
      };
      setAgendamentos(prev => [...(prev || []), novoComoAgendamento].sort(
        (a, b) => a.data_agendada.localeCompare(b.data_agendada) || a.hora_agendada.localeCompare(b.hora_agendada)
      ));
      const dataDoCompromisso = parseISO(newAppointment.data_agendada);
      setSelectedDate(dataDoCompromisso);
      setDisplayMonth(dataDoCompromisso);
      setExpandedAppointmentIds(prev => [...prev, data.id]);

      toast({
        title: "Sucesso",
        description: "Compromisso adicionado com sucesso!"
      });

      setNewAppointment({
        titulo: '',
        data_agendada: '',
        hora_agendada: '',
        descricao: '',
        cliente_nome: '',
        endereco: '',
        preco_acordado: ''
      });
      setIsAddingManual(false);
      await loadAgendamentos();
    } catch (err: unknown) {
      const errObj = err as { message?: string; details?: string; hint?: string };
      const msg = errObj?.message ?? errObj?.details ?? (typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : 'Não foi possível criar o compromisso.');
      toast({
        title: "Erro",
        description: msg,
        variant: "destructive"
      });
    }
  };

  const updateManualAppointment = async () => {
    if (!editingAppointmentId || !profile) return;
    if (!newAppointment.titulo.trim() || !newAppointment.data_agendada || !newAppointment.hora_agendada) {
      toast({
        title: "Erro",
        description: "Preencha título, data e horário.",
        variant: "destructive"
      });
      return;
    }
    try {
      const horaParaDb = newAppointment.hora_agendada.length === 5
        ? `${newAppointment.hora_agendada}:00`
        : newAppointment.hora_agendada;
      const precoNum = newAppointment.preco_acordado.trim() !== ''
        ? parseFloat(String(newAppointment.preco_acordado).replace(',', '.'))
        : null;

      const { data, error } = await supabase
        .from('agendamentos')
        .update({
          titulo: newAppointment.titulo.trim(),
          data_agendada: newAppointment.data_agendada,
          hora_agendada: horaParaDb,
          descricao: newAppointment.descricao.trim() || null,
          cliente_nome: newAppointment.cliente_nome.trim() || null,
          endereco: newAppointment.endereco.trim() || null,
          preco_acordado: precoNum != null && !Number.isNaN(precoNum) ? precoNum : null
        })
        .eq('id', editingAppointmentId)
        .eq('prestador_id', profile.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast({
          title: "Erro",
          description: "Não foi possível salvar as alterações. Sem permissão para atualizar este compromisso.",
          variant: "destructive"
        });
        return;
      }

      setAgendamentos(prev => (prev || []).map(a => a.id === editingAppointmentId ? { ...data, solicitante: a.solicitante } as Agendamento : a));
      setEditingAppointmentId(null);
      setNewAppointment({
        titulo: '',
        data_agendada: '',
        hora_agendada: '',
        descricao: '',
        cliente_nome: '',
        endereco: '',
        preco_acordado: ''
      });
      setIsAddingManual(false);
      toast({
        title: "Sucesso",
        description: "Compromisso atualizado com sucesso!"
      });
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      const msg = errObj?.message ?? (typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : 'Não foi possível atualizar o compromisso.');
      toast({
        title: "Erro",
        description: msg,
        variant: "destructive"
      });
    }
  };

  const openCreateModal = () => {
    setEditingAppointmentId(null);
    setNewAppointment({
      titulo: '',
      data_agendada: '',
      hora_agendada: '',
      descricao: '',
      cliente_nome: '',
      endereco: '',
      preco_acordado: ''
    });
    setIsAddingManual(true);
  };

  const handleManualModalOpenChange = (open: boolean) => {
    setIsAddingManual(open);
    if (!open) setEditingAppointmentId(null);
  };

  const sendNotificationToClient = async (agendamento: Agendamento, type: 'alteracao' | 'cancelamento' | 'lembrete') => {
    toast({
      title: "Notificação enviada",
      description: `Notificação de ${type} enviada ao cliente.`
    });
  };

  const cancelOrDeleteAppointment = async (agendamento: Agendamento) => {
    const isManual = agendamento.tipo_origem === 'manual';
    if (isManual) {
      if (!profile) return;
      try {
        const { error } = await supabase
          .from('agendamentos')
          .update({ status: 'cancelado' })
          .eq('id', agendamento.id)
          .eq('prestador_id', profile.id);
        if (error) throw error;
        setAgendamentos(prev => (prev || []).filter(a => a.id !== agendamento.id));
        toast({ title: "Sucesso", description: "Compromisso excluído." });
      } catch (e) {
        console.error('Error canceling appointment:', e);
        toast({ title: "Erro", description: "Não foi possível excluir o compromisso.", variant: "destructive" });
      }
    } else {
      await sendNotificationToClient(agendamento, 'cancelamento');
    }
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

            <Button type="button" onClick={openCreateModal} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Novo Compromisso
            </Button>
          </div>

          <Dialog open={isAddingManual} onOpenChange={handleManualModalOpenChange}>
            <DialogContent
                className="sm:max-w-md"
                onPointerDownOutside={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest?.('[data-modal-picker]')) e.preventDefault();
                }}
                onInteractOutside={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest?.('[data-modal-picker]')) e.preventDefault();
                }}
                onFocusOutside={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest?.('[data-modal-picker]')) e.preventDefault();
                }}
              >
                <div ref={el => setPickerContainer(el)} className="contents" />
                <DialogHeader>
                  <DialogTitle>
                    {editingAppointmentId ? 'Editar compromisso' : 'Adicionar Compromisso Manual'}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    {editingAppointmentId
                      ? 'Altere título, data, horário, descrição, endereço ou valor combinado deste compromisso manual.'
                      : 'Preencha título, data, horário e opcionalmente nome do cliente, descrição, endereço e valor para criar um compromisso na sua agenda.'}
                  </DialogDescription>
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
                      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen} modal={false}>
                        <PopoverTrigger asChild>
                          <Button
                            id="data"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-10 px-3",
                              !newAppointment.data_agendada && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
                            {newAppointment.data_agendada
                              ? format(parseISO(newAppointment.data_agendada), "dd 'de' MMMM, yyyy", { locale: ptBR })
                              : "Selecione a data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[100]" align="start" container={pickerContainer}>
                          <div data-modal-picker>
                            <Calendar
                              mode="single"
                              month={modalCalendarMonth}
                              onMonthChange={setModalCalendarMonth}
                              selected={newAppointment.data_agendada ? parseISO(newAppointment.data_agendada) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  setNewAppointment(prev => ({ ...prev, data_agendada: format(date, "yyyy-MM-dd") }));
                                  setDatePickerOpen(false);
                                }
                              }}
                              locale={ptBR}
                              components={{
                                Caption: (props) => (
                                  <CaptionComHoje {...props} onGoToToday={() => setModalCalendarMonth(new Date())} />
                                ),
                              }}
                              classNames={{
                                day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"),
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="hora">Horário *</Label>
                      <Popover open={timePickerOpen} onOpenChange={setTimePickerOpen} modal={false}>
                        <PopoverTrigger asChild>
                          <Button
                            id="hora"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-10 px-3",
                              !newAppointment.hora_agendada && "text-muted-foreground"
                            )}
                          >
                            <Clock className="mr-2 h-4 w-4 text-orange-500" />
                            {newAppointment.hora_agendada
                              ? (newAppointment.hora_agendada?.slice(0, 5) ?? newAppointment.hora_agendada)
                              : "Selecione o horário"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[100]" align="start" container={pickerContainer}>
                          <div data-modal-picker>
                            {(() => {
                              const parts = (newAppointment.hora_agendada?.slice(0, 5) ?? (newAppointment.hora_agendada || "08:00")).split(":");
                              const horaAtual = parts[0] ?? "08";
                              const minutoAtual = parts[1] ?? "00";
                              const setHora = (h: string) =>
                                setNewAppointment(prev => ({ ...prev, hora_agendada: `${h}:${minutoAtual}` }));
                              const setMinuto = (m: string) => {
                                setNewAppointment(prev => ({ ...prev, hora_agendada: `${horaAtual}:${m}` }));
                                setTimePickerOpen(false);
                              };
                              return (
                                <TimePickerColumns
                                  horaAtual={horaAtual}
                                  minutoAtual={minutoAtual}
                                  setHora={setHora}
                                  setMinuto={setMinuto}
                                />
                              );
                            })()}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  {newAppointment.data_agendada && newAppointment.hora_agendada && (
                    <p className="text-xs text-gray-600 leading-tight italic">
                      <span className="text-orange-600 font-medium">O compromisso será agendado para:</span>{' '}
                      {format(parseISO(newAppointment.data_agendada), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      {' às '}
                      {newAppointment.hora_agendada?.slice(0, 5) ?? newAppointment.hora_agendada}
                    </p>
                  )}
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
                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={newAppointment.endereco}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, endereco: e.target.value }))}
                      placeholder="Endereço do serviço ou entrega (opcional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preco_acordado">Valor combinado (R$)</Label>
                    <Input
                      id="preco_acordado"
                      type="text"
                      inputMode="decimal"
                      value={newAppointment.preco_acordado}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, preco_acordado: e.target.value }))}
                      placeholder="Ex: 150,00 (opcional)"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleManualModalOpenChange(false);
                        setNewAppointment({
                          titulo: '',
                          data_agendada: '',
                          hora_agendada: '',
                          descricao: '',
                          cliente_nome: '',
                          endereco: '',
                          preco_acordado: ''
                        });
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    {editingAppointmentId ? (
                      <Button onClick={updateManualAppointment} className="flex-1 bg-orange-500 hover:bg-orange-600">
                        Salvar alterações
                      </Button>
                    ) : (
                      <Button onClick={createManualAppointment} className="flex-1 bg-orange-500 hover:bg-orange-600">
                        Adicionar
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

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
                  <CardContent className={cn("p-3 flex flex-col items-center", isMobile && "p-4")}>
                    <div className={cn("w-full flex justify-center mx-auto", isMobile ? "max-w-full" : "max-w-[400px]")}>
                      <Calendar
                        mode="single"
                        month={displayMonth}
                        onMonthChange={setDisplayMonth}
                        selected={selectedDate}
                        onSelect={(date) => date && handleDayClick(date)}
                        onDayClick={handleDayClick}
                        locale={ptBR}
                        className={cn("rounded-md border", isMobile && "p-4")}
                        components={{
                          Caption: (props) => <CaptionComHoje {...props} onGoToToday={handleGoToToday} />,
                        }}
                        classNames={isMobile ? {
                          head_cell: "text-muted-foreground rounded-md w-12 font-normal text-[0.8rem]",
                          cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: cn(buttonVariants({ variant: "ghost" }), "h-12 w-12 p-0 font-normal aria-selected:opacity-100"),
                        } : undefined}
                        modifiers={{
                          hasAppointment: getDaysWithAppointments(),
                        }}
                        modifiersClassNames={{
                          hasAppointment: "relative after:content-[''] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-orange-500 aria-selected:after:bg-white",
                        }}
                      />
                    </div>
                    <div className="mt-4 text-center w-full">
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
                <Card className="border-0 bg-transparent shadow-none">
                  <CardHeader>
                    <CardTitle>
                      {selectedDate ? 
                        `Agendamentos - ${format(selectedDate, 'dd \'de\' MMMM', { locale: ptBR })}` : 
                        'Próximos Compromissos'
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedDate ? (() => {
                      const dayAppointments = getAppointmentsForDate(selectedDate);
                      if (dayAppointments.length === 0) {
                        return (
                          <div className="text-center py-8">
                            <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold mb-2">Nenhum agendamento</h3>
                            <p className="text-gray-600 mb-4">
                              Não há compromissos para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}.
                            </p>
                            <Button
                              onClick={openCreateModal}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Compromisso
                            </Button>
                          </div>
                        );
                      }
                      return (
                        <div
                          className={cn(
                            'space-y-4 max-h-96 overflow-y-auto',
                            !isMobile && [
                              '[scrollbar-width:none]',
                              '[&::-webkit-scrollbar]:w-2',
                              '[&::-webkit-scrollbar-track]:bg-transparent',
                              '[&::-webkit-scrollbar-thumb]:bg-transparent',
                              '[&::-webkit-scrollbar-thumb]:rounded-full',
                              'hover:[&::-webkit-scrollbar-thumb]:bg-gray-300',
                            ].join(' ')
                          )}
                        >
                          {dayAppointments.map(agendamento => (
                            expandedAppointmentIds.includes(agendamento.id) ? (
                              <Card
                                key={agendamento.id}
                                className="border-b-4 border-r-4 border-b-orange-500 border-r-orange-500 cursor-pointer"
                                onClick={() => closeAppointment(agendamento.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    closeAppointment(agendamento.id);
                                  }
                                }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
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
                                          <span className="font-medium">{agendamento.hora_agendada?.slice(0, 5) ?? agendamento.hora_agendada}</span>
                                        </div>
                                        {(agendamento.cliente_nome || agendamento.solicitante?.nome) && (
                                          <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-green-500 shrink-0" />
                                            {agendamento.tipo_origem === 'sistema' && agendamento.solicitante_id ? (
                                              <Link
                                                to={{ pathname: '/conversas', state: { openWithUserId: agendamento.solicitante_id } }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="font-medium text-primary hover:underline"
                                              >
                                                {agendamento.solicitante?.nome ?? agendamento.cliente_nome}
                                              </Link>
                                            ) : (
                                              <span className="font-medium">
                                                {agendamento.cliente_nome || agendamento.solicitante?.nome}
                                              </span>
                                            )}
                                          </div>
                                        )}
                                        {agendamento.endereco && (
                                          <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-purple-500" />
                                            <span className="flex-1">{agendamento.endereco}</span>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={(e) => { e.stopPropagation(); copyAddress(agendamento.endereco!); }}
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
                                          <p className="text-sm text-gray-700">{agendamento.descricao}</p>
                                        </div>
                                      )}
                                      <div className="flex flex-wrap gap-2 mt-4">
                                        {agendamento.solicitante && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => { e.stopPropagation(); navigate('/conversas'); }}
                                            className="flex items-center gap-1"
                                          >
                                            <MessageCircle className="h-3 w-3" />
                                            Contatar Cliente
                                          </Button>
                                        )}
                                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); sendNotificationToClient(agendamento, 'lembrete'); }} className="flex items-center gap-1">
                                          <Bell className="h-3 w-3" />
                                          Lembrete
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (agendamento.tipo_origem !== 'sistema') {
                                              setEditingAppointmentId(agendamento.id);
                                              setNewAppointment({
                                                titulo: agendamento.titulo,
                                                data_agendada: agendamento.data_agendada,
                                                hora_agendada: (agendamento.hora_agendada || '').slice(0, 5),
                                                descricao: agendamento.descricao ?? '',
                                                cliente_nome: agendamento.cliente_nome ?? '',
                                                endereco: agendamento.endereco ?? '',
                                                preco_acordado: agendamento.preco_acordado != null ? String(agendamento.preco_acordado) : ''
                                              });
                                              setIsAddingManual(true);
                                            } else {
                                              sendNotificationToClient(agendamento, 'alteracao');
                                            }
                                          }}
                                          className="flex items-center gap-1 text-blue-600"
                                        >
                                          <Edit className="h-3 w-3" />
                                          Alteração
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); cancelOrDeleteAppointment(agendamento); }} className="flex items-center gap-1 text-red-600">
                                          <AlertTriangle className="h-3 w-3" />
                                          {agendamento.tipo_origem === 'manual' ? 'Excluir' : 'Cancelar'}
                                        </Button>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      type="button"
                                      onClick={(e) => closeAppointment(agendamento.id, e)}
                                      className="shrink-0 h-8 w-8 rounded-md opacity-70 hover:opacity-100"
                                      aria-label="Fechar detalhes"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ) : (
                              <Card
                                key={agendamento.id}
                                className="border-b-4 border-r-4 border-b-orange-500 border-r-orange-500 cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => handleAppointmentClick(agendamento)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleAppointmentClick(agendamento);
                                  }
                                }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className="flex shrink-0 items-center justify-center text-lg font-semibold text-gray-800 tabular-nums min-w-[3.5rem]">
                                      {agendamento.hora_agendada?.slice(0, 5) ?? agendamento.hora_agendada}
                                    </div>
                                    <div className="flex flex-1 flex-col min-w-0 text-left">
                                      <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold truncate">{agendamento.titulo}</h3>
                                        <Badge className={getStatusColor(agendamento.status)}>
                                          {getStatusText(agendamento.status)}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                          <CalendarIcon className="h-4 w-4 text-orange-500 shrink-0" />
                                          <span>{format(parseISO(agendamento.data_agendada), 'dd/MM', { locale: ptBR })}</span>
                                        </div>
                                        {(agendamento.cliente_nome || agendamento.solicitante?.nome) && (
                                          <div className="flex items-center gap-1 min-w-0">
                                            <User className="h-4 w-4 text-green-500 shrink-0" />
                                            {agendamento.tipo_origem === 'sistema' && agendamento.solicitante_id ? (
                                              <Link
                                                to={{ pathname: '/conversas', state: { openWithUserId: agendamento.solicitante_id } }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="truncate text-primary hover:underline"
                                              >
                                                {agendamento.solicitante?.nome ?? agendamento.cliente_nome}
                                              </Link>
                                            ) : (
                                              <span className="truncate">{agendamento.cliente_nome || agendamento.solicitante?.nome}</span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          ))}
                        </div>
                      );
                    })() : (
                      <div className="text-center py-8 text-muted-foreground">
                        Selecione uma data no calendário.
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
