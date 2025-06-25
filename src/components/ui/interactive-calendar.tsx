
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Columns3, Grid } from 'lucide-react';
import CalendarGrid from './calendar/CalendarGrid';
import MeetingDetails from './calendar/MeetingDetails';
import MoreView from './calendar/MoreView';
import { DayType } from './calendar/types';
import { daysOfWeek } from './calendar/data';

const InteractiveCalendar = React.forwardRef<
  HTMLDivElement,
  { className?: string }
>(({ className }, ref) => {
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
                DEZ <span className="opacity-50">2024</span>
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
          <MeetingDetails selectedDay={selectedDay} onAddJob={handleAddJob} />
        )}

        {moreView && <MoreView hoveredDay={hoveredDay} />}
      </motion.div>
    </AnimatePresence>
  );
});
InteractiveCalendar.displayName = 'InteractiveCalendar';

const InteractiveCalendarDemo = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start bg-gray-50 px-4 py-10 md:justify-center">
      <InteractiveCalendar />
    </main>
  );
};

export default InteractiveCalendarDemo;
