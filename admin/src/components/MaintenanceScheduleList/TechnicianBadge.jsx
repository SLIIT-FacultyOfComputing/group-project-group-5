import React from 'react';
import PropTypes from 'prop-types';

const TechnicianBadge = ({ name, size = 'md' }) => {
  const getColor = (name) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs mr-1.5',
    md: 'w-8 h-8 text-sm mr-2',
    lg: 'w-10 h-10 text-base mr-3'
  };

  const colorClass = getColor(name);

  return (
    <div className="flex items-center">
      <div className={`${sizeClasses[size]} rounded-full ${colorClass} flex items-center justify-center`}>
        {name.charAt(0).toUpperCase()}
      </div>
      <span className="font-medium">{name}</span>
    </div>
  );
};

TechnicianBadge.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default TechnicianBadge;