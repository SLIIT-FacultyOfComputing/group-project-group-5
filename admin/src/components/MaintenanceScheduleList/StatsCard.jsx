import React from 'react';
import PropTypes from 'prop-types';

const StatsCard = ({ title, value, previousValue, icon, colorClass, isPercentage = false }) => {
  const percentChange = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
  const isIncrease = percentChange > 0;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 border border-gray-100 animate-fadeIn overflow-hidden relative">
      <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-bl-full -mr-12 -mt-12 opacity-50"></div>
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className={`text-2xl font-bold ${colorClass}`}>
            {isPercentage ? `${value}%` : value}
          </h3>
          
          {previousValue !== undefined && (
            <p className={`flex items-center text-xs mt-2 ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
              {isIncrease ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              {Math.abs(percentChange).toFixed(1)}% from previous
            </p>
          )}
        </div>
        
        <div className={`rounded-full p-3 ${colorClass.replace('text', 'bg')} bg-opacity-10`}>
          {icon}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`${colorClass.replace('text', 'bg')} h-1.5 rounded-full animate-widthGrow`}
            style={{ width: `${Math.min(value / 100, 1) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  previousValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icon: PropTypes.node.isRequired,
  colorClass: PropTypes.string.isRequired,
  isPercentage: PropTypes.bool
};

export default StatsCard;