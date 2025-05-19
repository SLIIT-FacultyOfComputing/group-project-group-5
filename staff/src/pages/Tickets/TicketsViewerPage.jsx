import React, { useState } from 'react';
import TicketsByRaiserPage from './TicketsByRaiserPage';
import TicketsAssignedPage from './TicketsAssignedPage';

const TicketsViewerPage = () => {
  const [activeTab, setActiveTab] = useState('assigned'); // Default to assigned tickets

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Tab selector */}
        <div className="flex bg-white rounded-lg shadow-sm mb-6 p-1">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'assigned'
                ? 'bg-rose-100 text-rose-700 shadow-sm'
                : 'text-gray-600 hover:text-rose-600'
            }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Assigned to Me
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('raised')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'raised'
                ? 'bg-rose-100 text-rose-700 shadow-sm'
                : 'text-gray-600 hover:text-rose-600'
            }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"></path>
              </svg>
              Raised by Me
            </div>
          </button>
        </div>

        {/* Show selected component based on active tab */}
        {activeTab === 'assigned' ? <TicketsAssignedPage /> : <TicketsByRaiserPage />}
      </div>
    </div>
  );
};

export default TicketsViewerPage;
