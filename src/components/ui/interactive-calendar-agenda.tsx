import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Columns3, Grid, MessageCircle } from 'lucide-react';

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

const Day: React.FC<DayProps> = ({ classNames, day, onHover, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
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
        {day.meetingInfo && (
          <motion.div
            className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-orange-500 p-1 text-[10px] font-bold text-white"
            layoutId={`day-${day.day}-meeting-count`}
            style={{
              borderRadius: 999,
            }}
          >
            {day.meetingInfo.length}
          </motion.div>
        )}

        <AnimatePresence>
          {day.meetingInfo && isHovered && (
            <div className="absolute inset-0 flex size-full items-center justify-center">
              <motion.div
                className="flex size-10 items-center justify-center bg-orange-500 p-1 text-xs font-bold text-white"
                layoutId={`day-${day.day}-meeting-count`}
                style={{
                  borderRadius: 999,
                }}
              >
                {day.meetingInfo.length}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const CalendarGrid: React.FC<{ 
  onHover: (day: string | null) => void;
  onDayClick: (day: DayType) => void;
}> = ({
  onHover,
  onDayClick,
}) => {
  return (
    <div className="grid grid-cols-7 gap-2">
      {DAYS.map((day, index) => (
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
    // Aqui você pode implementar a lógica para abrir o chat
  };

  const sortedDays = React.useMemo(() => {
    if (!hoveredDay) return DAYS;
    return [...DAYS].sort((a, b) => {
      if (a.day === hoveredDay) return -1;
      if (b.day === hoveredDay) return 1;
      return 0;
    });
  }, [hoveredDay]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        className="relative mx-auto my-10 flex w-full flex-col items-center justify-center gap-8 lg:flex-row"
      >
        <motion.div layout className="w-full max-w-lg">
          <motion.div
            key="calendar-view"
            className="flex w-full flex-col gap-4"
          >
            <div className="flex w-full items-center justify-between">
              <motion.h2 className="mb-2 text-4xl font-bold tracking-wider text-gray-800">
                NOV <span className="opacity-50">2024</span>
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
                ></div>
              </motion.button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="px-0/5 rounded-xl bg-gray-200 py-1 text-center text-xs text-gray-700"
                >
                  {day}
                </div>
              ))}
            </div>
            <CalendarGrid onHover={handleDayHover} onDayClick={handleDayClick} />
          </motion.div>
        </motion.div>

        {selectedDay && selectedDay.meetingInfo && (
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
                <motion.button
                  onClick={handleAddJob}
                  className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors duration-200"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Trabalho
                </motion.button>
              </div>
              <motion.div className="flex flex-col gap-3 rounded-xl border-2 border-gray-300 bg-white p-4 shadow-md">
                {selectedDay.meetingInfo.map((meeting, index) => (
                  <motion.div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-800">{meeting.date}</span>
                      <span className="text-sm text-gray-800">{meeting.time}</span>
                    </div>
                    
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">{meeting.title}</h4>
                    
                    {meeting.clientName && (
                      <p className="mb-1 text-sm text-gray-700 font-medium">
                        Cliente: {meeting.clientName}
                      </p>
                    )}
                    
                    {meeting.address && (
                      <p className="mb-2 text-sm text-gray-600">
                        Endereço: {meeting.address}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      {meeting.value && (
                        <div className="text-green-600 font-semibold">
                          R$ {meeting.value.toFixed(2).replace('.', ',')}
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleChatWithClient(meeting.clientId, meeting.clientName)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Conversar
                      </button>
                    </div>
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
                  Agendamentos
                </motion.h2>
                <p className="font-medium text-gray-600">
                  Veja os próximos trabalhos agendados e histórico de serviços.
                </p>
              </div>
              <motion.div
                className="flex h-[620px] flex-col items-start justify-start overflow-hidden overflow-y-scroll rounded-xl border-2 border-gray-300 bg-white shadow-md"
                layout
              >
                <AnimatePresence>
                  {sortedDays
                    .filter((day) => day.meetingInfo)
                    .map((day) => (
                      <motion.div
                        key={day.day}
                        className={`w-full border-b-2 border-gray-200 py-0 last:border-b-0`}
                        layout
                      >
                        {day.meetingInfo &&
                          day.meetingInfo.map((meeting, mIndex) => (
                            <motion.div
                              key={mIndex}
                              className="border-b border-gray-200 p-4 last:border-b-0"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{
                                duration: 0.2,
                                delay: mIndex * 0.05,
                              }}
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-gray-800">
                                  {meeting.date}
                                </span>
                                <span className="text-sm text-gray-800">
                                  {meeting.time}
                                </span>
                              </div>
                              
                              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                {meeting.title}
                              </h3>
                              
                              {meeting.clientName && (
                                <p className="mb-1 text-sm text-gray-700 font-medium">
                                  Cliente: {meeting.clientName}
                                </p>
                              )}
                              
                              {meeting.address && (
                                <p className="mb-2 text-sm text-gray-600">
                                  Endereço: {meeting.address}
                                </p>
                              )}
                              
                              <div className="flex items-center justify-between mt-3">
                                {meeting.value && (
                                  <div className="text-green-600 font-semibold">
                                    R$ {meeting.value.toFixed(2).replace('.', ',')}
                                  </div>
                                )}
                                
                                <button
                                  onClick={() => handleChatWithClient(meeting.clientId, meeting.clientName)}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  Conversar
                                </button>
                              </div>
                            </motion.div>
                          ))}
                      </motion.div>
                    ))}
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

const DAYS: DayType[] = [
  { day: '-3', classNames: 'bg-gray-100' },
  { day: '-2', classNames: 'bg-gray-100' },
  { day: '-1', classNames: 'bg-gray-100' },
  { day: '01', classNames: 'bg-white border border-gray-200' },
  {
    day: '02',
    classNames: 'bg-white border border-gray-200 cursor-pointer',
    meetingInfo: [
      {
        date: 'Qua, 2 Nov',
        time: '10:00 - 11:00',
        title: 'Instalação Elétrica Residencial',
        participants: ['João Silva', 'Maria Santos'],
        location: 'Rua das Flores, 123',
        clientName: 'João Silva',
        address: 'Rua das Flores, 123 - Centro',
        value: 250.00,
        clientId: 'client-001'
      },
      {
        date: 'Qua, 2 Nov',
        time: '13:00 - 14:00',
        title: 'Manutenção de Ar Condicionado',
        participants: ['Carlos Oliveira', 'Ana Costa'],
        location: 'Av. Paulista, 456',
        clientName: 'Ana Costa',
        address: 'Av. Paulista, 456 - Bela Vista',
        value: 180.00,
        clientId: 'client-002'
      },
    ],
  },
  { day: '03', classNames: 'bg-white border border-gray-200' },
  {
    day: '04',
    classNames: 'bg-gray-100',
  },
  { day: '05', classNames: 'bg-gray-100' },
  {
    day: '06',
    classNames: 'bg-white border border-gray-200 cursor-pointer',
    meetingInfo: [
      {
        date: 'Seg, 6 Nov',
        time: '10:00 - 11:00',
        title: 'Limpeza Pós-Obra',
        participants: ['Sara Pereira', 'Kamal Nunes'],
        location: 'Rua Augusta, 789',
        clientName: 'Sara Pereira',
        address: 'Rua Augusta, 789 - Vila Madalena',
        value: 320.00,
        clientId: 'client-003'
      },
    ],
  },
  { day: '07', classNames: 'bg-white border border-gray-200' },
  {
    day: '08',
    classNames: 'bg-white border border-gray-200 cursor-pointer',
    meetingInfo: [
      {
        date: 'Qua, 8 Nov',
        time: '14:00 - 15:00',
        title: 'Pintura Residencial',
        participants: ['Roberto Verde', 'David Lima'],
        location: 'Rua dos Jardins, 321',
        clientName: 'Roberto Verde',
        address: 'Rua dos Jardins, 321 - Jardins',
        value: 450.00,
        clientId: 'client-004'
      },
      {
        date: 'Qua, 8 Nov',
        time: '16:00 - 17:00',
        title: 'Consultoria Financeira',
        participants: ['Jessica Branca', 'Tom Henrique'],
        location: 'Centro Empresarial',
        clientName: 'Jessica Branca',
        address: 'Centro Empresarial - Itaim Bibi',
        value: 200.00,
        clientId: 'client-005'
      },
      {
        date: 'Qua, 8 Nov',
        time: '17:30 - 18:30',
        title: 'Reparo Hidráulico',
        participants: ['Bob Silva', 'Emma Pedra'],
        location: 'Presencial',
        clientName: 'Bob Silva',
        address: 'Rua das Palmeiras, 89 - Moema',
        value: 150.00,
        clientId: 'client-006'
      },
    ],
  },
  { day: '09', classNames: 'bg-white border border-gray-200' },
  {
    day: '10',
    classNames: 'bg-white border border-gray-200',
  },
  { day: '11', classNames: 'bg-gray-100' },
  {
    day: '12',
    classNames: 'bg-gray-100',
  },
  { day: '13', classNames: 'bg-white border border-gray-200' },
  { day: '14', classNames: 'bg-white border border-gray-200' },
  {
    day: '15',
    classNames: 'bg-white border border-gray-200 cursor-pointer',
    meetingInfo: [
      {
        date: 'Qua, 15 Nov',
        time: '09:00 - 10:00',
        title: 'Avaliação de Imóvel',
        participants: ['Sarah Pereira', 'Kamal Nunes'],
        location: 'Presencial no Escritório',
        clientName: 'Sarah Pereira',
        address: 'Rua dos Três Irmãos, 456 - Vila Progredior',
        value: 300.00,
        clientId: 'client-007'
      },
    ],
  },
  { day: '16', classNames: 'bg-white border border-gray-200' },
  {
    day: '17',
    classNames: 'bg-white border border-gray-200 cursor-pointer',
    meetingInfo: [
      {
        date: 'Sex, 17 Nov',
        time: '09:00 - 10:00',
        title: 'Jardinagem e Paisagismo',
        participants: ['David Lima', 'Sofia Jovem'],
        location: 'Condomínio Verde',
        clientName: 'David Lima',
        address: 'Condomínio Verde - Alphaville',
        value: 380.00,
        clientId: 'client-008'
      },
      {
        date: 'Sex, 17 Nov',
        time: '11:00 - 12:00',
        title: 'Consultoria Imobiliária',
        participants: ['Sara Pereira', 'Kamal Nunes'],
        location: 'Presencial',
        clientName: 'Sara Pereira',
        address: 'Av. Faria Lima, 1200 - Itaim',
        value: 280.00,
        clientId: 'client-009'
      },
      {
        date: 'Sex, 17 Nov',
        time: '14:00 - 15:00',
        title: 'Demonstração de Sistema',
        participants: ['Bob Silva', 'Emma Pedra'],
        location: 'Online',
        clientName: 'Bob Silva',
        address: 'Online (Remoto)',
        value: 120.00,
        clientId: 'client-010'
      },
      {
        date: 'Sex, 17 Nov',
        time: '16:00 - 17:00',
        title: 'Feedback do Cliente',
        participants: ['Marcos Lima', 'Alice João'],
        location: 'Videochamada',
        clientName: 'Marcos Lima',
        address: 'Videochamada (Remoto)',
        value: 80.00,
        clientId: 'client-011'
      },
    ],
  },
  { day: '18', classNames: 'bg-gray-100' },
  {
    day: '19',
    classNames: 'bg-gray-100',
  },
  { day: '20', classNames: 'bg-white border border-gray-200' },
  {
    day: '21',
    classNames: 'bg-white border border-gray-200 cursor-pointer',
    meetingInfo: [
      {
        date: 'Ter, 21 Nov',
        time: '11:00 - 12:00',
        title: 'Lançamento de Produto',
        participants: ['Alice João', 'Marcos Lima'],
        location: 'Online',
        clientName: 'Alice João',
        address: 'Online (Remoto)',
        value: 150.00,
        clientId: 'client-012'
      },
      {
        date: 'Ter, 21 Nov',
        time: '13:00 - 14:00',
        title: 'Feedback do Cliente',
        participants: ['Sara Pereira', 'Kamal Nunes'],
        location: 'Videochamada',
        clientName: 'Sara Pereira',
        address: 'Videochamada (Remoto)',
        value: 90.00,
        clientId: 'client-013'
      },
      {
        date: 'Ter, 21 Nov',
        time: '15:00 - 16:00',
        title: 'Design de Interiores',
        participants: ['David Lima', 'Sofia Jovem'],
        location: 'Presencial',
        clientName: 'David Lima',
        address: 'Rua Oscar Freire, 789 - Jardins',
        value: 420.00,
        clientId: 'client-014'
      },
      {
        date: 'Ter, 21 Nov',
        time: '17:00 - 18:00',
        title: 'Celebração da Equipe',
        participants: ['Bob Silva', 'Jessica Branca'],
        location: 'Terraço do Escritório',
        clientName: 'Bob Silva',
        address: 'Terraço do Escritório - Vila Olímpia',
        value: 200.00,
        clientId: 'client-015'
      },
      {
        date: 'Ter, 21 Nov',
        time: '19:00 - 20:00',
        title: 'Happy Hour',
        participants: ['Tom Henrique', 'Emma Pedra'],
        location: 'Bar Local',
        clientName: 'Tom Henrique',
        address: 'Bar Local - Vila Madalena',
        value: 100.00,
        clientId: 'client-016'
      },
    ],
  },
  { day: '22', classNames: 'bg-white border border-gray-200' },
  { day: '23', classNames: 'bg-white border border-gray-200' },
  {
    day: '24',
    classNames: 'bg-white border border-gray-200',
  },
  { day: '25', classNames: 'bg-gray-100' },
  { day: '26', classNames: 'bg-gray-100' },
  {
    day: '27',
    classNames: 'bg-white border border-gray-200',
  },
  { day: '28', classNames: 'bg-white border border-gray-200' },
  {
    day: '29',
    classNames: 'bg-white border border-gray-200',
  },
  {
    day: '30',
    classNames: 'bg-white border border-gray-200 cursor-pointer',
    meetingInfo: [
      {
        date: 'Qui, 30 Nov',
        time: '11:00 - 12:00',
        title: 'Sessão de Brainstorming',
        participants: ['David Lima', 'Sofia Jovem'],
        location: 'Online',
        clientName: 'David Lima',
        address: 'Online (Remoto)',
        value: 180.00,
        clientId: 'client-017'
      },
    ],
  },
  { day: '+1', classNames: 'bg-gray-100' },
  { day: '+2', classNames: 'bg-gray-100' },
];

const daysOfWeek = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

export default InteractiveCalendarAgenda;
