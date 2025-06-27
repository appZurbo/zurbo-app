import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Columns3, Grid, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
export type DayType = {
  day: string;
  classNames: string;
  meetingInfo?: {
    date: string;
    time: string;
    title: string;
    participants: string[];
    location: string;
    clientName?: string;
    address?: string;
    value?: number;
    clientId?: string;
  }[];
};
interface DayProps {
  classNames: string;
  day: DayType;
  onHover: (day: string | null) => void;
  onClick: (day: DayType) => void;
}
const Day: React.FC<DayProps> = ({
  classNames,
  day,
  onHover,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return <>
      <motion.div className={`relative flex items-center justify-center py-1 cursor-pointer ${classNames}`} style={{
      height: '4rem',
      borderRadius: 16
    }} onMouseEnter={() => {
      setIsHovered(true);
      onHover(day.day);
    }} onMouseLeave={() => {
      setIsHovered(false);
      onHover(null);
    }} onClick={() => onClick(day)} id={`day-${day.day}`}>
        <motion.div className="flex flex-col items-center justify-center">
          {!(day.day[0] === '+' || day.day[0] === '-') && <span className="text-sm text-gray-800">{day.day}</span>}
        </motion.div>
        {day.meetingInfo && <motion.div className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-orange-500 p-1 text-[10px] font-bold text-white" layoutId={`day-${day.day}-meeting-count`} style={{
        borderRadius: 999
      }}>
            {day.meetingInfo.length}
          </motion.div>}

        <AnimatePresence>
          {day.meetingInfo && isHovered && <div className="absolute inset-0 flex size-full items-center justify-center">
              <motion.div className="flex size-10 items-center justify-center bg-orange-500 p-1 text-xs font-bold text-white" layoutId={`day-${day.day}-meeting-count`} style={{
            borderRadius: 999
          }}>
                {day.meetingInfo.length}
              </motion.div>
            </div>}
        </AnimatePresence>
      </motion.div>
    </>;
};
const CalendarGrid: React.FC<{
  onHover: (day: string | null) => void;
  onDayClick: (day: DayType) => void;
  currentMonth: number;
  currentYear: number;
}> = ({
  onHover,
  onDayClick,
  currentMonth,
  currentYear
}) => {
  // Generate days for the current month/year
  const generateDaysForMonth = (month: number, year: number): DayType[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    const days: DayType[] = [];

    // Previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth - i;
      days.push({
        day: `-${day}`,
        classNames: 'bg-gray-100'
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayString = day.toString().padStart(2, '0');
      const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

      // Check if this day has meetings (using original mock data for November 2024)
      const mockMeetings = getMockMeetingsForDay(dayString, month, year);
      days.push({
        day: dayString,
        classNames: `${isToday ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white'} border border-gray-200 ${mockMeetings ? 'cursor-pointer' : ''}`,
        meetingInfo: mockMeetings
      });
    }

    // Next month's leading days
    const remainingSlots = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingSlots; day++) {
      days.push({
        day: `+${day}`,
        classNames: 'bg-gray-100'
      });
    }
    return days;
  };
  const days = generateDaysForMonth(currentMonth, currentYear);
  return <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => <Day key={`${day.day}-${index}`} classNames={day.classNames} day={day} onHover={onHover} onClick={onDayClick} />)}
    </div>;
};

// Mock meetings data (you can replace this with real data)
const getMockMeetingsForDay = (day: string, month: number, year: number) => {
  // Only show mock data for November 2024 for now
  if (month !== 10 || year !== 2024) return null;
  const mockData: {
    [key: string]: any[];
  } = {
    '02': [{
      date: 'Qua, 2 Nov',
      time: '10:00 - 11:00',
      title: 'Instalação Elétrica Residencial',
      participants: ['João Silva', 'Maria Santos'],
      location: 'Rua das Flores, 123',
      clientName: 'João Silva',
      address: 'Rua das Flores, 123 - Centro',
      value: 250.00,
      clientId: 'client-001'
    }, {
      date: 'Qua, 2 Nov',
      time: '13:00 - 14:00',
      title: 'Manutenção de Ar Condicionado',
      participants: ['Carlos Oliveira', 'Ana Costa'],
      location: 'Av. Paulista, 456',
      clientName: 'Ana Costa',
      address: 'Av. Paulista, 456 - Bela Vista',
      value: 180.00,
      clientId: 'client-002'
    }],
    '06': [{
      date: 'Seg, 6 Nov',
      time: '10:00 - 11:00',
      title: 'Limpeza Pós-Obra',
      participants: ['Sara Pereira', 'Kamal Nunes'],
      location: 'Rua Augusta, 789',
      clientName: 'Sara Pereira',
      address: 'Rua Augusta, 789 - Vila Madalena',
      value: 320.00,
      clientId: 'client-003'
    }],
    '08': [{
      date: 'Qua, 8 Nov',
      time: '14:00 - 15:00',
      title: 'Pintura Residencial',
      participants: ['Roberto Verde', 'David Lima'],
      location: 'Rua dos Jardins, 321',
      clientName: 'Roberto Verde',
      address: 'Rua dos Jardins, 321 - Jardins',
      value: 450.00,
      clientId: 'client-004'
    }]
  };
  return mockData[day] || null;
};
const getMonthName = (month: number): string => {
  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  return months[month];
};
const InteractiveCalendarAgenda = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [moreView, setMoreView] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayType | null>(null);
  const handleDayHover = (day: string | null) => {
    setHoveredDay(day);
  };
  const handleDayClick = (day: DayType) => {
    if (day.meetingInfo && day.meetingInfo.length > 0) {
      setSelectedDay(day);
    } else {
      setSelectedDay(null);
    }
  };
  const handleAddJob = () => {
    console.log('Add new job for day:', selectedDay?.day);
  };
  const handleChatWithClient = (clientId?: string, clientName?: string) => {
    console.log('Opening chat with client:', clientName, clientId);
  };
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
    setSelectedDay(null); // Clear selected day when changing months
  };
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(null);
  };
  return <AnimatePresence mode="wait">
      <motion.div ref={ref} className="relative mx-auto my-10 flex w-full flex-col items-center justify-center gap-8 lg:flex-row">
        <motion.div layout className="w-full max-w-lg">
          <motion.div key="calendar-view" className="flex w-full flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-0">
                <motion.h2 className="mb-2 text-4xl font-bold tracking-wider text-gray-800">
                  {getMonthName(currentMonth)} <span className="opacity-50">{currentYear}</span>
                </motion.h2>
                <div className="flex items-center gap-0">
                  <button onClick={() => navigateMonth('prev')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Mês anterior">
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button onClick={goToToday} className="px-3 py-1 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors" title="Ir para hoje">
                    Hoje
                  </button>
                  <button onClick={() => navigateMonth('next')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Próximo mês">
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <motion.button onClick={() => setMoreView(!moreView)} className="relative flex items-center gap-3 rounded-lg border border-gray-300 px-1.5 py-1 text-gray-600">
                <Columns3 className="z-[2]" />
                <Grid className="z-[2]" />
                <div className="absolute left-0 top-0 h-[85%] w-7 rounded-md bg-orange-500 transition-transform duration-300" style={{
                top: '50%',
                transform: moreView ? 'translateY(-50%) translateX(40px)' : 'translateY(-50%) translateX(4px)'
              }}></div>
              </motion.button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map(day => <div key={day} className="px-0/5 rounded-xl bg-gray-200 py-1 text-center text-xs text-gray-700">
                  {day}
                </div>)}
            </div>
            <CalendarGrid onHover={handleDayHover} onDayClick={handleDayClick} currentMonth={currentMonth} currentYear={currentYear} />
          </motion.div>
        </motion.div>

        {selectedDay && selectedDay.meetingInfo && <motion.div className="w-full max-w-lg" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: 20
      }} transition={{
        duration: 0.3
      }}>
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full items-center justify-between">
                <motion.h3 className="text-2xl font-bold tracking-wider text-gray-800">
                  Agendamentos - Dia {selectedDay.day}
                </motion.h3>
                <motion.button onClick={handleAddJob} className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors duration-200">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Trabalho
                </motion.button>
              </div>
              <motion.div className="flex flex-col gap-3 rounded-xl border-2 border-gray-300 bg-white p-4 shadow-md">
                {selectedDay.meetingInfo.map((meeting, index) => <motion.div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0" initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.2,
              delay: index * 0.05
            }}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-800">{meeting.date}</span>
                      <span className="text-sm text-gray-800">{meeting.time}</span>
                    </div>
                    
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">{meeting.title}</h4>
                    
                    {meeting.clientName && <p className="mb-1 text-sm text-gray-700 font-medium">
                        Cliente: {meeting.clientName}
                      </p>}
                    
                    {meeting.address && <p className="mb-2 text-sm text-gray-600">
                        Endereço: {meeting.address}
                      </p>}
                    
                    <div className="flex items-center justify-between mt-3">
                      {meeting.value && <div className="text-green-600 font-semibold">
                          R$ {meeting.value.toFixed(2).replace('.', ',')}
                        </div>}
                      
                      <button onClick={() => handleChatWithClient(meeting.clientId, meeting.clientName)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200">
                        <MessageCircle className="h-4 w-4" />
                        Conversar
                      </button>
                    </div>
                  </motion.div>)}
              </motion.div>
            </div>
          </motion.div>}

        {moreView && <motion.div className="w-full max-w-lg" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: 20
      }} transition={{
        duration: 0.3
      }}>
            <motion.div key="more-view" className="mt-4 flex w-full flex-col gap-4">
              <div className="flex w-full flex-col items-start justify-between">
                <motion.h2 className="mb-2 text-4xl font-bold tracking-wider text-gray-800">
                  Agendamentos
                </motion.h2>
                <p className="font-medium text-gray-600">
                  Veja os próximos trabalhos agendados e histórico de serviços.
                </p>
              </div>
              <motion.div className="flex h-[620px] flex-col items-start justify-start overflow-hidden overflow-y-scroll rounded-xl border-2 border-gray-300 bg-white shadow-md" layout>
                <div className="w-full p-4 text-center text-gray-500">
                  Lista completa de agendamentos para {getMonthName(currentMonth)} {currentYear}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>}
      </motion.div>
    </AnimatePresence>;
});
InteractiveCalendarAgenda.displayName = 'InteractiveCalendarAgenda';
const daysOfWeek = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
export default InteractiveCalendarAgenda;