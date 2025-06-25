
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayProps } from './types';

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
  );
};

export default Day;
