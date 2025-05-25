import React from 'react';
import PropTypes from 'prop-types';

const ActionButton = ({ onClick, icon, label, color = 'blue', size = 'md', isRounded = false }) => {
  const sizeClasses = 
    size === 'sm' ? 'px-2 py-1 text-xs' :
    size === 'lg' ? 'px-5 py-3 text-base' :
    'px-4 py-2 text-sm';
  
  const colorClasses = 
    color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300' :
    color === 'red' ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300' :
    color === 'green' ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300' :
    color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300' :
    'bg-gray-500 hover:bg-gray-600 focus:ring-gray-300';

  const shapeClasses = isRounded ? 'rounded-full' : 'rounded-md';

  return (
    <button
      onClick={onClick}
      className={`${colorClasses} ${sizeClasses} ${shapeClasses} text-white transition-colors duration-300 flex items-center justify-center focus:outline-none focus:ring-2 shadow-sm hover:shadow transform hover:-translate-y-0.5`}
      title={label}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {!isRounded && label && <span>{label}</span>}
    </button>
  );
};

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node,
  label: PropTypes.string,
  color: PropTypes.oneOf(['blue', 'red', 'green', 'yellow', 'gray']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isRounded: PropTypes.bool
};

export default ActionButton;