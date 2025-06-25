
import React from 'react';
import { motion } from 'framer-motion';
import { DayType } from './types';

interface MeetingDetailsProps {
  selectedDay: DayType;
  onAddJob: () => void;
}

const MeetingDetails: React.FC<MeetingDetailsProps> = ({ selectedDay, onAddJob }) => {
  return (
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
            onClick={onAddJob}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors duration-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Trabalho
          </motion.button>
        </div>
        <motion.div className="flex flex-col gap-3 rounded-xl border-2 border-gray-300 bg-white p-4 shadow-md">
          {selectedDay.meetingInfo?.map((meeting, index) => (
            <motion.div
              key={index}
              className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-800">{meeting.date}</span>
                <span className="text-sm text-gray-800">{meeting.time}</span>
              </div>
              <h4 className="mb-1 text-lg font-semibold text-gray-900">{meeting.title}</h4>
              <p className="mb-1 text-sm text-gray-600">{meeting.participants.join(', ')}</p>
              <div className="flex items-center text-orange-500">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{meeting.location}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MeetingDetails;
