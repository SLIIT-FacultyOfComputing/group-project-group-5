import React from 'react';

const StatusChangePreview = ({ currentStatus }) => {
  const statusSteps = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const currentIndex = statusSteps.indexOf(currentStatus);
  
  if (currentStatus === 'CLOSED') {
    return (
      <div className="mt-2">
        <div className="w-full bg-red-400 h-2 rounded-full mb-2"></div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Ticket will be CLOSED</h3>
              <div className="mt-1 text-sm text-red-700">
                This ticket will be marked as CLOSED and no further action will be taken.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
              Status Update Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-green-600">
              {Math.round(((currentIndex + 1) / 3) * 100)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div style={{ width: `${((currentIndex + 1) / 3) * 100}%` }} 
               className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"></div>
        </div>
      </div>
      
      {/* Add the connection line positioned in the middle of the circles */}
      <div className="relative h-10 mt-4">
        {/* Background gray line */}
        <div className="absolute top-4 left-5 right-5 h-0.5 bg-gray-200 z-0"></div>
        {/* Green progress line */}
        <div 
          className="absolute top-4 left-5 h-0.5 bg-green-500 z-0 transition-all duration-500"
          style={{ 
            width: currentIndex === 0 
              ? '0%' 
              : currentIndex === 1 
                ? 'calc(50% - 10px)' 
                : 'calc(100% - 20px)' 
          }}
        ></div>
      </div>
      
      <div className="flex justify-between relative z-10 -mt-10">
        {['OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = status === currentStatus;
          
          return (
            <div key={status} className={`flex flex-col items-center ${isCurrent ? 'transform scale-110' : ''}`}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all
                ${isActive 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-400'
                }
                ${isCurrent ? 'ring-4 ring-green-100' : ''}
                z-20 relative
              `}>
                {index === 0 && (
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                )}
                {index === 1 && (
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3-8a1 1 0 01-1 1H8a1 1 0 010-2h4a1 1 0 011 1z" clipRule="evenodd" />
                  </svg>
                )}
                {index === 2 && (
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-xs font-medium mt-1 ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                {status.replace('_', ' ')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusChangePreview;
