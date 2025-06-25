
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayType } from './types';
import { DAYS } from './data';

interface MoreViewProps {
  hoveredDay: string | null;
}

const MoreView: React.FC<MoreViewProps> = ({ hoveredDay }) => {
  const sortedDays = React.useMemo(() => {
    if (!hoveredDay) return DAYS;
    return [...DAYS].sort((a, b) => {
      if (a.day === hoveredDay) return -1;
      if (b.day === hoveredDay) return 1;
      return 0;
    });
  }, [hoveredDay]);

  return (
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
                        className="border-b border-gray-200 p-3 last:border-b-0"
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
                        <h3 className="mb-1 text-lg font-semibold text-gray-900">
                          {meeting.title}
                        </h3>
                        <p className="mb-1 text-sm text-gray-600">
                          {meeting.participants.join(', ')}
                        </p>
                        <div className="flex items-center text-orange-500">
                          <svg
                            className="mr-1 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm">
                            {meeting.location}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MoreView;
