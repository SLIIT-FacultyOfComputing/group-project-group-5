import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DateRangePicker = ({ onRangeChange, initialRange = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState(initialRange || {
    start: null,
    end: null
  });
  const [hoverDate, setHoverDate] = useState(null);
  
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return { month: today.getMonth(), year: today.getFullYear() };
  });
  
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const generateCalendarDays = () => {
    const { month, year } = currentMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const prevMonthDays = [];
    const prevMonthDaysCount = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      prevMonthDays.push({
        day: prevMonthDaysCount - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false
      });
    }
    
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      month,
      year,
      isCurrentMonth: true
    }));
    
    const totalDaysSoFar = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDays = Array.from({ length: (42 - totalDaysSoFar) }, (_, i) => ({
      day: i + 1,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false
    }));
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = prev.month - 1;
      if (newMonth < 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { month: newMonth, year: prev.year };
    });
  };
  
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = prev.month + 1;
      if (newMonth > 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { month: newMonth, year: prev.year };
    });
  };
  
  const formatDayToString = (day) => {
    return `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
  };
  
  const isInRange = (dateStr) => {
    if (!range.start || !range.end) return false;
    
    const date = new Date(dateStr);
    const start = new Date(range.start);
    const end = new Date(range.end);
    
    return date >= start && date <= end;
  };
  
  const isRangeEnd = (dateStr) => {
    if (!range.start || !range.end) return false;
    return dateStr === range.start || dateStr === range.end;
  };
  
  const handleDayClick = (day) => {
    const dateStr = formatDayToString(day);
    
    if (!range.start || (range.start && range.end)) {
      setRange({ start: dateStr, end: null });
    } else {
      const startDate = new Date(range.start);
      const clickedDate = new Date(dateStr);
      
      if (clickedDate < startDate) {
        setRange({ start: dateStr, end: range.start });
      } else {
        setRange({ start: range.start, end: dateStr });
      }
      
      onRangeChange({ start: range.start, end: dateStr });
    }
  };
  
  const handleDayHover = (day) => {
    if (range.start && !range.end) {
      setHoverDate(formatDayToString(day));
    }
  };
  
  const isInHoverRange = (dateStr) => {
    if (!range.start || !hoverDate || range.end) return false;
    
    const date = new Date(dateStr);
    const start = new Date(range.start);
    const hover = new Date(hoverDate);
    
    if (hover < start) {
      return date >= hover && date <= start;
    } else {
      return date >= start && date <= hover;
    }
  };
  
  return (
    <div className="relative">
      <button
        className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {range.start && range.end ? (
          <span className="text-gray-700">
            {formatDate(range.start)} - {formatDate(range.end)}
          </span>
        ) : (
          <span className="text-gray-500">Select date range</span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute mt-2 bg-white rounded-lg shadow-lg p-4 z-20 border border-gray-200 animate-scaleIn" style={{ width: '300px' }}>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center font-medium">
              {new Date(currentMonth.year, currentMonth.month).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <button
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
            
            {generateCalendarDays().map((day, i) => {
              const dateStr = formatDayToString(day);
              const isRangeStart = range.start === dateStr;
              const isRangeEndDate = range.end === dateStr;
              const isInSelectedRange = isInRange(dateStr);
              const isHoverRange = isInHoverRange(dateStr);
              const isHoverRangeStart = range.start && hoverDate === dateStr;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;
              
              return (
                <div
                  key={i}
                  className={`
                    relative text-center p-1 text-sm cursor-pointer transition-all duration-150
                    ${day.isCurrentMonth ? 'hover:bg-blue-50 text-gray-700' : 'text-gray-400'} 
                    ${isToday ? 'font-semibold border border-gray-300 rounded-full' : ''}
                    ${isRangeStart || isRangeEndDate ? 'bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-full z-10' : ''}
                    ${isInSelectedRange && !isRangeEnd(dateStr) ? 'bg-blue-100' : ''}
                    ${isHoverRange && !isHoverRangeStart ? 'bg-blue-50' : ''}
                  `}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => handleDayHover(day)}
                >
                  {day.day}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => {
                setRange({ start: null, end: null });
                onRangeChange({ start: null, end: null });
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

DateRangePicker.propTypes = {
  onRangeChange: PropTypes.func.isRequired,
  initialRange: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string
  })
};

export default DateRangePicker;