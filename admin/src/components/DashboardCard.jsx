import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({ title, value, icon, color = 'blue' }) => {
  const bgColorMap = {
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };
  
  const bgColor = bgColorMap[color] || 'bg-blue-50';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-4 text-red transform transition-all duration-300 hover:scale-105`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-full bg-white bg-opacity-30`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['blue', 'indigo', 'green', 'yellow', 'red', 'purple'])
};

export default DashboardCard;