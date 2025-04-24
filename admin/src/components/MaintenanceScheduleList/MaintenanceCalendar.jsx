import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MaintenanceCalendar = ({ schedules, equipmentData = [] }) => {
  const [months, setMonths] = useState([]);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const today = new Date();
    const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    setMonths([prevMonth, currentMonth, nextMonth]);
    setCurrentMonthIndex(1);
  }, []);
  
  const goToPreviousMonth = () => {
    setMonths(prevMonths => {
      const firstMonth = new Date(prevMonths[0]);
      const newPrevMonth = new Date(firstMonth.getFullYear(), firstMonth.getMonth() - 1, 1);
      return [newPrevMonth, prevMonths[0], prevMonths[1]];
    });
  };
  
  const goToNextMonth = () => {
    setMonths(prevMonths => {
      const lastMonth = new Date(prevMonths[2]);
      const newNextMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1);
      return [prevMonths[1], prevMonths[2], newNextMonth];
    });
  };
  
  const getDaysInMonth = (month) => {
    return new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (month) => {
    return new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  };

  const formatMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  const maintenanceDateMap = schedules.reduce((acc, schedule) => {
    const dateKey = new Date(schedule.maintenanceDate).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    const equipment = equipmentData.find(e => e.id === schedule.equipmentId);
    const equipmentName = equipment ? equipment.name : 'Unknown Equipment';
    
    acc[dateKey].push({
      id: schedule.scheduleId,
      equipmentId: schedule.equipmentId || 'N/A',
      equipmentName: equipmentName,
      status: schedule.status,
      type: schedule.maintenanceType || 'General Maintenance'
    });
    return acc;
  }, {});
  
  const getMaintenanceInfo = (date) => {
    const dateKey = date.toDateString();
    return maintenanceDateMap[dateKey] || [];
  };

  const getDateClassName = (date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const maintenanceInfo = getMaintenanceInfo(date);
    
    let classes = "flex items-center justify-center h-8 w-8 rounded-full text-sm transition-colors duration-200 ";
    
    if (isToday) {
      classes += "border-2 border-rose-500 font-bold ";
    }
    
    if (maintenanceInfo.length > 0) {
      const hasScheduled = maintenanceInfo.some(info => info.status === 'SCHEDULED');
      const hasInProgress = maintenanceInfo.some(info => info.status === 'INPROGRESS');
      const hasCompleted = maintenanceInfo.some(info => info.status === 'COMPLETED');
      const hasCanceled = maintenanceInfo.some(info => info.status === 'CANCELED');

      if (hasInProgress) {
        classes += "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 ";
      } else if (hasScheduled) {
        classes += "bg-blue-100 text-blue-800 hover:bg-blue-200 ";
      } else if (hasCompleted) {
        classes += "bg-green-100 text-green-800 hover:bg-green-200 ";
      } else if (hasCanceled) {
        classes += "bg-red-100 text-red-800 hover:bg-red-200 ";
      }
    } else {
      classes += "hover:bg-gray-100 ";
    }
    
    return classes;
  };

  const handleMouseEnter = (e, date) => {
    const maintenanceInfo = getMaintenanceInfo(date);
    if (maintenanceInfo.length > 0) {
      const rect = e.target.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + (rect.width / 2),
        y: rect.top - 20
      });
      setTooltipContent({
        date: date,
        items: maintenanceInfo
      });
    }
  };
  
  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  const renderMonth = (month, index) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDayOfMonth = getFirstDayOfMonth(month);
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const maintenanceInfo = getMaintenanceInfo(date);
      
      days.push(
        <div key={`day-${day}`} className="relative">
          <button 
            className={getDateClassName(date)}
            onMouseEnter={(e) => handleMouseEnter(e, date)}
            onMouseLeave={handleMouseLeave}
          >
            {day}
          </button>
          {maintenanceInfo.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 text-xs text-white flex items-center justify-center">
                {maintenanceInfo.length > 9 ? '9+' : maintenanceInfo.length}
              </span>
            </span>
          )}
        </div>
      );
    }
    
    return (
      <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-md font-medium text-gray-900 mb-4 text-center">{formatMonthName(month)}</h3>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center mb-1">{day}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Maintenance Calendar
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            aria-label="Previous month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            aria-label="Next month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {months.map((month, index) => (
          <div key={index} className={`
            ${index === 0 ? 'hidden md:block' : ''}
            ${index === 1 ? 'block' : ''}
            ${index === 2 ? 'hidden lg:block' : ''}
          `}>
            {renderMonth(month, index)}
          </div>
        ))}
      </div>
      
      {tooltipContent && (
        <div 
          className="fixed z-[1000] bg-white p-3 rounded-md shadow-lg border border-gray-200 text-sm"
          style={{ 
            top: `${tooltipPosition.y}px`, 
            left: `${tooltipPosition.x}px`,
            transform: 'translate(-50%, -100%)',
            maxWidth: '300px',
            maxHeight: '300px',
            overflow: 'auto'
          }}
        >
          <div className="font-medium mb-2">{tooltipContent.date.toLocaleDateString()}</div>
          <div className="space-y-2">
            {tooltipContent.items.map((item, idx) => (
              <div key={idx} className="border-t pt-1 first:border-t-0 first:pt-0">
                <div className="font-medium">{item.equipmentName}</div>
                <div className="text-xs text-gray-600">Equipment ID: {item.equipmentId}</div>
                <div className="text-xs text-gray-600">Repair Type: {item.type}</div>
                <div className="text-xs mt-1">
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium
                    ${item.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : ''}
                    ${item.status === 'INPROGRESS' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                    ${item.status === 'CANCELED' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-center mt-4 gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-200 mr-2"></div>
          <span className="text-xs text-gray-600">Scheduled</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-200 mr-2"></div>
          <span className="text-xs text-gray-600">In Progress</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-100 border border-green-200 mr-2"></div>
          <span className="text-xs text-gray-600">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-100 border border-red-200 mr-2"></div>
          <span className="text-xs text-gray-600">Canceled</span>
        </div>
      </div>
    </div>
  );
};

MaintenanceCalendar.propTypes = {
  schedules: PropTypes.array.isRequired,
  equipmentData: PropTypes.array
};

MaintenanceCalendar.defaultProps = {
  schedules: [],
  equipmentData: []
};

export default MaintenanceCalendar;
