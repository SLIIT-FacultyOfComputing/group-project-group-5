import React from 'react';

const FilterButtons = ({ 
  type, 
  currentFilter, 
  setFilter, 
  counts 
}) => {
  const getButtonConfig = () => {
    if (type === 'status') {
      return [
        { 
          id: 'ALL', 
          label: 'All', 
          icon: (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
            </svg>
          ),
          activeClass: 'bg-rose-600 text-white',
          count: counts.ALL
        },
        { 
          id: 'OPEN', 
          label: 'Open', 
          icon: (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 0h4m-4 0H8m4 0v4"></path>
            </svg>
          ),
          activeClass: 'bg-yellow-600 text-white',
          count: counts.OPEN
        },
        { 
          id: 'IN_PROGRESS', 
          label: 'In Progress', 
          icon: (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15"></path>
            </svg>
          ),
          activeClass: 'bg-blue-600 text-white',
          count: counts.IN_PROGRESS
        },
        { 
          id: 'RESOLVED', 
          label: 'Resolved', 
          icon: (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          ),
          activeClass: 'bg-purple-600 text-white',
          count: counts.RESOLVED
        },
        { 
          id: 'CLOSED', 
          label: 'Closed', 
          icon: (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ),
          activeClass: 'bg-red-600 text-white',
          count: counts.CLOSED
        }
      ];
    } else if (type === 'priority') {
      return [
        { 
          id: 'ALL', 
          label: 'All Priorities', 
          icon: (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
            </svg>
          ),
          activeClass: 'bg-rose-600 text-white',
          count: counts.ALL
        },
        { 
          id: 'LOW', 
          label: 'Low', 
          icon: (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
          ),
          activeClass: 'bg-green-600 text-white',
          count: counts.LOW
        },
        { 
          id: 'MEDIUM', 
          label: 'Medium', 
          icon: (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          ),
          activeClass: 'bg-yellow-600 text-white',
          count: counts.MEDIUM
        },
        { 
          id: 'HIGH', 
          label: 'High', 
          icon: (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          ),
          activeClass: 'bg-red-600 text-white',
          count: counts.HIGH
        }
      ];
    }
    return [];
  };

  const buttons = getButtonConfig();

  return (
    <div className="bg-gray-50 p-4 border-b border-gray-200 overflow-x-auto">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Filter by {type === 'status' ? 'Status' : 'Priority'}
      </h3>
      <div className="flex flex-wrap gap-2">
        {buttons.map(button => (
          <button 
            key={button.id}
            onClick={() => setFilter(button.id)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center shadow-sm ${
              currentFilter === button.id 
                ? button.activeClass
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {button.icon}
            {button.label} ({button.count})
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterButtons;
