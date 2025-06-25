
export type DayType = {
  day: string;
  classNames: string;
  meetingInfo?: {
    date: string;
    time: string;
    title: string;
    participants: string[];
    location: string;
  }[];
};

export interface DayProps {
  classNames: string;
  day: DayType;
  onHover: (day: string | null) => void;
  onClick: (day: DayType) => void;
}

export interface CalendarGridProps {
  onHover: (day: string | null) => void;
  onDayClick: (day: DayType) => void;
}
