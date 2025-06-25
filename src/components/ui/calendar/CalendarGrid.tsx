
import React from 'react';
import Day from './Day';
import { CalendarGridProps } from './types';
import { DAYS } from './data';

const CalendarGrid: React.FC<CalendarGridProps> = ({ onHover, onDayClick }) => {
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

export default CalendarGrid;
