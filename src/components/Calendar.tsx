"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { he } from "date-fns/locale";
import { ChevronRight, ChevronLeft } from "lucide-react";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const WEEK_DAYS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

export default function Calendar({ events, selectedDate, onSelectDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  function hasEvents(day: Date) {
    const dateStr = format(day, "yyyy-MM-dd");
    return events.some((e) => e.date === dateStr);
  }

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center active:bg-neutral-800 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy", { locale: he })}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center active:bg-neutral-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-center text-xs text-neutral-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const today = isToday(day);
          const dayHasEvents = hasEvents(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all active:scale-95
                ${!isCurrentMonth ? "opacity-20" : ""}
                ${isSelected ? "bg-white text-black" : ""}
                ${!isSelected && today ? "bg-neutral-800" : ""}
                ${!isSelected && !today ? "active:bg-neutral-900" : ""}
              `}
            >
              <span className={`${today && !isSelected ? "font-bold" : ""}`}>
                {format(day, "d")}
              </span>
              {dayHasEvents && isCurrentMonth && (
                <div className={`absolute bottom-1.5 w-1 h-1 rounded-full ${isSelected ? "bg-black" : "bg-white"}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
