
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Columns3, Grid, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './button';
import { useToast } from '@/hooks/use-toast';

export type AgendaItem = {
  id: string;
  data_agendada: string;
  hora_agendada: string;
  titulo: string;
  descricao?: string;
  cliente_nome?: string;
  endereco?: string;
  status: string;
  preco_acordado?: number;
};

export type DayType = {
  day: string;
  classNames: string;
  agendamentos?: AgendaItem[];
};

interface DayProps {
  classNames: string;
  day: DayType;
  onHover: (day: string | null) => void;
  onClick: (day: DayType) => void;
}

const Day: React.FC<DayProps> = ({ classNames, day, onHover, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      className={`relative flex items-center justify-center py-1 cursor-pointer ${classNames}`}
      style={{ height: '4rem', borderRadius: 16 }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover(day.day);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover(null);
      }}
      onClick={() => onClick(day)}
      id={`day-${day.day}`}
    >
      <motion.div className="flex flex-col items-center justify-center">
        {!(day.day[0] === '+' || day.day[0] === '-') && (
          <span className="text-sm text-gray-800">{day.day}</span>
        )}
      </motion.div>
      
      {day.agendamentos && day.agendamentos.length > 0 && (
        <motion.div
          className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-orange-500 p-1 text-[10px] font-bold text-white"
          layoutId={`day-${day.day}-agenda-count`}
          style={{ borderRadius: 999 }}
        >
          {day.agendamentos.length}
        </motion.div>
      )}

      <AnimatePresence>
        {day.agendamentos && day.agendamentos.length > 0 && isHovered && (
          <div className="absolute inset-0 flex size-full items-center justify-center">
            <motion.div
              className="flex size-10 items-center justify-center bg-orange-500 p-1 text-xs font-bold text-white"
              layoutId={`day-${day.day}-agenda-count`}
              style={{ borderRadius: 999 }}
            >
              {day.agendamentos.length}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CalendarGrid: React.FC<{ 
  days: DayType[];
  onHover: (day: string | null) => void;
  onDayClick: (day: DayType) => void;
}> = ({ days, onHover, onDayClick }) => {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => (
        <Day
          key={`${day.day}-${index}`}
          classNames={day.classNames}
          day={day}
          onHover={onHover}
          onClick={onDayClick}
        />
      ))}
    </div>
  );
};

const InteractiveCalendarAgenda = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [moreView, setMoreView] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayType | null>(null);
  const [days, setDays] = useState<DayType[]>([]);
  const [agendamentos, setAgendamentos] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  // Gerar dias do mês atual
  const generateDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const generatedDays: DayType[] = [];

    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      generatedDays.push({
        day: `-${i + 1}`,
        classNames: 'bg-gray-100'
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      generatedDays.push({
        day: day.toString().padStart(2, '0'),
        classNames: isToday 
          ? 'bg-orange-100 border-2 border-orange-500' 
          : 'bg-white border border-gray-200'
      });
    }

    // Dias do próximo mês para completar a grade
    const totalCells = 42; // 6 semanas × 7 dias
    const remainingCells = totalCells - generatedDays.length;
    for (let day = 1; day <= remainingCells; day++) {
      generatedDays.push({
        day: `+${day}`,
        classNames: 'bg-gray-100'
      });
    }

    return generatedDays;
  };

  const loadAgendamentos = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('prestador_id', profile.id)
        .order('data_agendada', { ascending: true });

      if (error) throw error;

      const agendamentosData = data.map(item => ({
        id: item.id,
        data_agendada: item.data_agendada,
        hora_agendada: item.hora_agendada,
        titulo: item.titulo || 'Serviço agendado',
        descricao: item.descricao,
        cliente_nome: item.cliente_nome,
        endereco: item.endereco,
        status: item.status,
        preco_acordado: item.preco_acordado
      }));

      setAgendamentos(agendamentosData);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialDays = generateDays();
    setDays(initialDays);
    if (profile) {
      loadAgendamentos();
    }
  }, [profile]);

  useEffect(() => {
    // Mapear agendamentos para os dias
    const updatedDays = days.map(day => {
      if (day.day.includes('+') || day.day.includes('-')) return day;
      
      const dayNumber = parseInt(day.day);
      const today = new Date();
      const currentDate = new Date(today.getFullYear(), today.getMonth(), dayNumber);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const dayAgendamentos = agendamentos.filter(ag => ag.data_agendada === dateString);
      
      return {
        ...day,
        agendamentos: dayAgendamentos.length > 0 ? dayAgendamentos : undefined
      };
    });
    
    setDays(updatedDays);
  }, [agendamentos]);

  const handleDayHover = (day: string | null) => {
    setHoveredDay(day);
  };

  const handleDayClick = (day: DayType) => {
    if (day.agendamentos && day.agendamentos.length > 0) {
      setSelectedDay(day);
    } else {
      setSelectedDay(null);
    }
  };

  const handleAddAgendamento = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Em breve você poderá adicionar novos agendamentos diretamente pelo calendário"
    });
  };

  const currentMonth = new Date().toLocaleDateString('pt-BR', { 
    month: 'short', 
    year: 'numeric' 
  }).toUpperCase();

  const daysOfWeek = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        className="relative mx-auto my-4 flex w-full flex-col items-center justify-center gap-8 lg:flex-row"
        {...props}
      >
        <motion.div layout className="w-full max-w-lg">
          <motion.div
            key="calendar-view"
            className="flex w-full flex-col gap-4"
          >
            <div className="flex w-full items-center justify-between">
              <motion.h2 className="mb-2 text-4xl font-bold tracking-wider text-gray-800">
                {currentMonth}
              </motion.h2>
              <motion.button
                className="relative flex items-center gap-3 rounded-lg border border-gray-300 px-1.5 py-1 text-gray-600"
                onClick={() => setMoreView(!moreView)}
              >
                <Columns3 className="z-[2]" />
                <Grid className="z-[2]" />
                <div
                  className="absolute left-0 top-0 h-[85%] w-7 rounded-md bg-orange-500 transition-transform duration-300"
                  style={{
                    top: '50%',
                    transform: moreView
                      ? 'translateY(-50%) translateX(40px)'
                      : 'translateY(-50%) translateX(4px)',
                  }}
                />
              </motion.button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="rounded-xl bg-gray-200 py-1 text-center text-xs text-gray-700"
                >
                  {day}
                </div>
              ))}
            </div>
            <CalendarGrid days={days} onHover={handleDayHover} onDayClick={handleDayClick} />
          </motion.div>
        </motion.div>

        {selectedDay && selectedDay.agendamentos && (
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full items-center justify-between">
                <motion.h3 className="text-2xl font-bold tracking-wider text-gray-800">
                  Agendamentos - Dia {selectedDay.day}
                </motion.h3>
                <Button
                  onClick={handleAddAgendamento}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              <motion.div className="flex flex-col gap-3 rounded-xl border-2 border-gray-300 bg-white p-4 shadow-md">
                {selectedDay.agendamentos.map((agendamento, index) => (
                  <motion.div
                    key={agendamento.id}
                    className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-800">
                        {new Date(agendamento.data_agendada).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-sm text-gray-800">{agendamento.hora_agendada}</span>
                    </div>
                    <h4 className="mb-1 text-lg font-semibold text-gray-900">{agendamento.titulo}</h4>
                    {agendamento.cliente_nome && (
                      <p className="mb-1 text-sm text-gray-600">Cliente: {agendamento.cliente_nome}</p>
                    )}
                    {agendamento.endereco && (
                      <div className="flex items-center text-orange-500">
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{agendamento.endereco}</span>
                      </div>
                    )}
                    {agendamento.preco_acordado && (
                      <p className="text-sm font-semibold text-green-600">
                        R$ {agendamento.preco_acordado.toFixed(2)}
                      </p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {moreView && (
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              key="more-view"
              className="mt-4 flex w-full flex-col gap-4"
            >
              <div className="flex w-full flex-col items-start justify-between">
                <motion.h2 className="mb-2 text-4xl font-bold tracking-wider text-gray-800">
                  Todos os Agendamentos
                </motion.h2>
                <p className="font-medium text-gray-600">
                  Veja todos os seus agendamentos em ordem cronológica.
                </p>
              </div>
              <motion.div
                className="flex h-[620px] flex-col items-start justify-start overflow-hidden overflow-y-scroll rounded-xl border-2 border-gray-300 bg-white shadow-md"
                layout
              >
                <AnimatePresence>
                  {agendamentos.length > 0 ? (
                    agendamentos.map((agendamento, index) => (
                      <motion.div
                        key={agendamento.id}
                        className="w-full border-b border-gray-200 p-3 last:border-b-0"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm text-gray-800">
                            {new Date(agendamento.data_agendada).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="text-sm text-gray-800">{agendamento.hora_agendada}</span>
                        </div>
                        <h3 className="mb-1 text-lg font-semibold text-gray-900">
                          {agendamento.titulo}
                        </h3>
                        {agendamento.cliente_nome && (
                          <p className="mb-1 text-sm text-gray-600">
                            Cliente: {agendamento.cliente_nome}
                          </p>
                        )}
                        {agendamento.endereco && (
                          <div className="flex items-center text-orange-500">
                            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm">{agendamento.endereco}</span>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <p className="text-gray-500">Nenhum agendamento encontrado</p>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
});

InteractiveCalendarAgenda.displayName = 'InteractiveCalendarAgenda';

export default InteractiveCalendarAgenda;
