import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">날짜 검색</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-s-line text-xl text-gray-600"></i>
          </button>
          <span className="text-sm font-semibold text-gray-700 min-w-[100px] text-center">
            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
          </span>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer transition-colors"
          >
            <i className="ri-arrow-right-s-line text-xl text-gray-600"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-semibold py-2 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}

        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {daysInMonth.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const dayOfWeek = day.getDay();

          return (
            <button
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-orange-500 text-white font-bold'
                  : isToday
                  ? 'bg-orange-100 text-orange-600 font-semibold'
                  : 'hover:bg-gray-100'
              } ${
                dayOfWeek === 0
                  ? 'text-red-500'
                  : dayOfWeek === 6
                  ? 'text-blue-500'
                  : 'text-gray-700'
              }`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}