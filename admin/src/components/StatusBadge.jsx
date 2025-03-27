import React from 'react';
import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
  let bgColor, textColor;
  
  switch (status) {
    case 'SCHEDULED':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'INPROGRESS':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'COMPLETED':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'CANCELED':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  return (
    <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

export default StatusBadge;