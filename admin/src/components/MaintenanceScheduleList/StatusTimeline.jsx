import React from 'react';
import PropTypes from 'prop-types';

const StatusTimeline = ({
  currentStatus,
  animationDelay = 0,
  timestamps = {},
  showDetails = true,
  compact = false,
  className = ''
}) => {
  const statuses = ['SCHEDULED', 'INPROGRESS', 'COMPLETED', 'CANCELED', 'OVERDUE'];
  const currentIndex = statuses.indexOf(currentStatus);
  
  const displayStatuses = statuses.filter(status => !['CANCELED', 'OVERDUE'].includes(status));
  const isCanceled = currentStatus === 'CANCELED';
  const isOverdue = currentStatus === 'OVERDUE';

  const getStatusName = (status) => {
    switch(status) {
      case 'SCHEDULED': return 'Scheduled';
      case 'INPROGRESS': return 'In Progress';
      case 'COMPLETED': return 'Completed';
      case 'CANCELED': return 'Canceled';
      case 'OVERDUE': return 'Overdue';
      default: return status;
    }
  };

  const getStatusIcon = (status, isCompleted) => {
    if (isCompleted) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      );
    }
    
    switch(status) {
      case 'SCHEDULED':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'INPROGRESS':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'COMPLETED':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return <span className="text-sm font-medium">{displayStatuses.indexOf(status) + 1}</span>;
    }
  };

  const getStatusColor = (status, isActive, isCompleted) => {
    if (isCompleted) return 'bg-green-500 text-white border-green-600';
    if (isActive) {
      switch(status) {
        case 'SCHEDULED': return 'bg-blue-500 text-white border-blue-600 shadow-md';
        case 'INPROGRESS': return 'bg-yellow-500 text-white border-yellow-600 shadow-md';
        case 'COMPLETED': return 'bg-green-500 text-white border-green-600 shadow-md';
        case 'CANCELED': return 'bg-red-500 text-white border-red-600 shadow-md';
        case 'OVERDUE': return 'bg-orange-500 text-white border-orange-600 shadow-md';
        default: return 'bg-blue-500 text-white border-blue-600 shadow-md';
      }
    }
    return 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200 transition-colors duration-200';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = () => {
    if (isCanceled || isOverdue) return 100;
    switch(currentIndex) {
      case -1: return 0;
      case 0: return 0; 
      case 1: return 50;
      case 2: return 100;
      default: return 0;
    }
  };

  const getProgressColor = () => {
    if (isCanceled) return 'bg-red-500';
    if (isOverdue) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className={`w-full py-2 ${className}`}>
      {(isCanceled || isOverdue) ? (
        <div className="mb-6">
          <div className={`flex items-center mb-2 animate-fadeIn`} style={{ animationDelay: `${animationDelay + 0.1}s` }}>
            <div className={`w-full ${isCanceled ? 'bg-red-100' : 'bg-orange-100'} rounded-full h-2.5`}>
              <div className={`${isCanceled ? 'bg-red-500' : 'bg-orange-500'} h-2.5 rounded-full w-full animate-pulse`}></div>
            </div>
            <span className={`ml-2 ${isCanceled ? 'text-red-600' : 'text-orange-600'} font-medium`}>
              {isCanceled ? 'Canceled' : 'Overdue'}
            </span>
          </div>
          
          {showDetails && (
            <div className={`mt-2 p-3 rounded-md ${isCanceled ? 'bg-red-50 border border-red-100' : 'bg-orange-50 border border-orange-100'} animate-fadeIn`} 
                 style={{ animationDelay: `${animationDelay + 0.2}s` }}>
              <div className="flex items-start">
                <div className={`p-1 rounded-full ${isCanceled ? 'bg-red-100' : 'bg-orange-100'} mr-2`}>
                  {isCanceled ? (
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${isCanceled ? 'text-red-700' : 'text-orange-700'}`}>
                    {isCanceled ? 'Maintenance Canceled' : 'Maintenance Overdue'}
                  </h4>
                  <p className={`text-xs mt-1 ${isCanceled ? 'text-red-600' : 'text-orange-600'}`}>
                    {isCanceled ? 
                      'This maintenance schedule has been canceled.' : 
                      'This maintenance is past its scheduled completion date.'}
                  </p>
                  {timestamps[currentStatus] && (
                    <p className="text-xs mt-1 text-gray-500">
                      {formatTimestamp(timestamps[currentStatus])}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={`flex items-center ${compact ? 'justify-between' : 'justify-around'} mb-6`}>
            {displayStatuses.map((status, index) => {
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;
              
              return (
                <div key={status} className="relative group">
                  {index > 0 && (
                    <div className="absolute top-4 w-full h-0.5 bg-gray-200 -left-1/2 -z-10">
                      {index <= currentIndex && (
                        <div 
                          className="absolute top-0 h-0.5 bg-green-500 animate-widthGrow" 
                          style={{ 
                            width: isActive ? '50%' : '100%',
                            left: 0,
                            animationDelay: `${animationDelay + (index * 0.15)}s`
                          }}
                        ></div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center">
                    <div 
                      className={`
                        w-9 h-9 rounded-full flex items-center justify-center 
                        border-2 ${getStatusColor(status, isActive, isCompleted)}
                        transition-all duration-300 animate-scaleIn
                        ${isActive ? 'ring-4 ring-opacity-30 ring-blue-300' : ''}
                      `}
                      style={{ animationDelay: `${animationDelay + (index * 0.1)}s` }}
                      aria-current={isActive ? "step" : undefined}
                      title={getStatusName(status)}
                    >
                      {getStatusIcon(status, isCompleted)}
                    </div>
                    
                    <div className={`text-xs mt-2 font-medium ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                      {getStatusName(status)}
                    </div>
                    
                    {showDetails && timestamps[status] && (
                      <div className="text-xs mt-1 text-gray-400">
                        {formatTimestamp(timestamps[status])}
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-gray-800 text-white text-xs rounded p-2 shadow-lg">
                      <p className="font-semibold mb-1">{getStatusName(status)}</p>
                      {timestamps[status] ? (
                        <p>Updated: {formatTimestamp(timestamps[status])}</p>
                      ) : (
                        <p>{isCompleted ? 'Completed' : isActive ? 'Current status' : 'Pending'}</p>
                      )}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative h-1.5 w-full mb-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`absolute h-full ${getProgressColor()} rounded-full transition-all duration-500 animate-widthGrow`}
              style={{ 
                width: `${getProgressPercentage()}%`,
                animationDelay: `${animationDelay + 0.3}s`
              }}
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={getProgressPercentage()}
            ></div>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            {getProgressPercentage() === 100 ? 
              'Maintenance completed' : 
              `Maintenance ${getProgressPercentage()}% complete`
            }
          </div>
        </>
      )}
    </div>
  );
};

StatusTimeline.propTypes = {
  currentStatus: PropTypes.oneOf(['SCHEDULED', 'INPROGRESS', 'COMPLETED', 'CANCELED', 'OVERDUE']).isRequired,
  animationDelay: PropTypes.number,
  timestamps: PropTypes.object,
  showDetails: PropTypes.bool,
  compact: PropTypes.bool,
  className: PropTypes.string
};

export default StatusTimeline;