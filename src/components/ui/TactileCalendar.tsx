
import React, { useMemo } from 'react';

interface TactileCalendarProps {
    date?: Date;
    onClick?: () => void;
    className?: string;
}

const TactileCalendar = ({
    date = new Date(),
    onClick,
    className = ""
}: TactileCalendarProps) => {

    const { day, weekDay } = useMemo(() => {
        return {
            day: date.getDate(),
            weekDay: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase()
        };
    }, [date]);

    return (
        <div
            onClick={onClick}
            className={`relative group cursor-pointer select-none ${className}`}
            style={{ width: '52px', height: '52px' }}
        >
            {/* Back Layer (Paper stack effect) */}
            <div className="absolute top-1 left-0.5 w-full h-full bg-orange-200 rounded-[14px] shadow-sm border border-orange-300 transform -rotate-3" />

            {/* Main Calendar Card */}
            <div className="relative w-full h-full bg-white rounded-[14px] shadow-md border-b-[3px] border-r border-gray-100 flex flex-col items-center overflow-hidden active:scale-95 transition-transform duration-200">

                {/* Header (Month/Binding) */}
                <div className="h-[18px] w-full bg-[#E05815] flex items-center justify-center relative shadow-sm">
                    <span className="text-[9px] font-black text-white tracking-widest leading-none mt-0.5">
                        {weekDay}
                    </span>
                </div>

                {/* Date Display */}
                <div className="flex-1 flex items-center justify-center pb-1">
                    <span className="text-2xl font-black text-gray-800 tracking-tighter leading-none">
                        {day}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TactileCalendar;
