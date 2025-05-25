import React from 'react';

const TicketTypeForm = ({ ticketData, setTicketData, isSubmitting }) => {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Ticket Information
      </h2>
      
      <div className="space-y-4 sm:space-y-5">
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="type" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
            Ticket Type 
            <span className="text-red-500 ml-1">*</span>
            <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <input
              id="type"
              name="type"
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
              type="text"
              placeholder="Enter ticket type (e.g., Fix login issue)"
              value={ticketData.type}
              onChange={(e) => setTicketData({ ...ticketData, type: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="priority" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
            Priority 
            <span className="text-red-500 ml-1">*</span>
            <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <select
              id="priority"
              name="priority"
              className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block appearance-none transition-all duration-200 shadow-sm hover:border-gray-400"
              value={ticketData.priority}
              onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
              disabled={isSubmitting}
            >
              <option value="LOW" className="py-1">LOW</option>
              <option value="MEDIUM" className="py-1">MEDIUM</option>
              <option value="HIGH" className="py-1">HIGH</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium flex items-center ${ticketData.priority === 'LOW' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-600'}`}>
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
          </svg>
          Low
        </div>
        <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium flex items-center ${ticketData.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-gray-100 text-gray-600'}`}>
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
          </svg>
          Medium
        </div>
        <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium flex items-center ${ticketData.priority === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-gray-100 text-gray-600'}`}>
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
          High
        </div>
      </div>
    </div>
  );
};

export default TicketTypeForm;
