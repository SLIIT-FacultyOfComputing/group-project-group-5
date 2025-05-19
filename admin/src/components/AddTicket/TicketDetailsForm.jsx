import React from 'react';

const TicketDetailsForm = ({ ticketData, setTicketData, isSubmitting }) => {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Ticket Details
      </h2>
      
      <div className="space-y-4 sm:space-y-5">
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="assignee" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
            Raise by
            <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Optional)</span>
          </label>
          
          <div className="mb-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="assignStaff"
                  name="assigneeType"
                  type="radio"
                  value="STAFF"
                  checked={ticketData.assigneeType === 'STAFF'}
                  onChange={(e) => setTicketData({ ...ticketData, assigneeType: e.target.value })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <label htmlFor="assignStaff" className="ml-2 block text-sm text-gray-700">
                  Staff
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="assignMember"
                  name="assigneeType"
                  type="radio"
                  value="MEMBER"
                  checked={ticketData.assigneeType === 'MEMBER'}
                  onChange={(e) => setTicketData({ ...ticketData, assigneeType: e.target.value })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <label htmlFor="assignMember" className="ml-2 block text-sm text-gray-700">
                  Member
                </label>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            {ticketData.assigneeType === 'STAFF' ? (
              <input
                id="staffId"
                name="staffId"
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                type="text"
                placeholder="Enter staff ID (e.g., 2)"
                value={ticketData.staffId}
                onChange={(e) => setTicketData({ ...ticketData, staffId: e.target.value })}
                disabled={isSubmitting}
              />
            ) : (
              <input
                id="memberId"
                name="memberId"
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                type="number"
                placeholder="Enter member ID (e.g., 5)"
                value={ticketData.memberId}
                onChange={(e) => setTicketData({ ...ticketData, memberId: e.target.value })}
                disabled={isSubmitting}
              />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Leave empty if unassigned. {ticketData.assigneeType === 'STAFF' ? 'Staff' : 'member'} will be responsible for this ticket.</p>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
            Description 
            <span className="text-red-500 ml-1">*</span>
            <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </div>
            <textarea
              id="description"
              name="description"
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
              placeholder="Describe the issue in detail..."
              rows="5"
              value={ticketData.description}
              onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsForm;
