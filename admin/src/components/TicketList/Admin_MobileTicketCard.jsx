import React from 'react';
import StatusBadge from './StatusBadge';

const getAssignedToInfo = (ticket) => {
  if (!ticket.assignedToId && !ticket.assignedToName) {
    return 'Not assigned';
  }
  
  const name = ticket.assignedToName || 'Unknown';
  const id = ticket.assignedToId || 'N/A';
  
  return `${name} (Staff ID: ${id})`;
};

const MobileTicketCard = ({
  tickets,
  expandedTicket,
  setExpandedTicket,
  handleStatusChange,
  handleUpdateStatus,
  handleAssignTicket,
  selectedStatuses,
  loading,
  resetFilters,
  formatDate,
  getTicketId
}) => {
  return (
    <div className="md:hidden p-4">
      {tickets && tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={getTicketId(ticket) || Math.random()} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-medium text-gray-500">ID: {getTicketId(ticket)}</span>
                <StatusBadge status={ticket.status} />
              </div>
              
              <div className="flex justify-between items-start mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {ticket.type}
                </span>
                <span className="text-xs text-gray-500">{formatDate(ticket.createdAt)}</span>
              </div>

              <p className="text-sm text-gray-800 mb-3 pb-3 border-b border-gray-100">
                {ticket.description 
                  ? `${ticket.description.substring(0, 100)}${ticket.description.length > 100 ? '...' : ''}`
                  : 'No description provided'}
              </p>

              <div className="mb-3">
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Assigned to:</p>
                <p className="text-sm font-medium">{getAssignedToInfo(ticket)}</p>
              </div>

              <button
                onClick={() => setExpandedTicket(expandedTicket === getTicketId(ticket) ? null : getTicketId(ticket))}
                className="w-full px-4 py-2 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700 focus:ring-4 focus:ring-rose-300 transition-all duration-200 text-sm flex items-center justify-center"
              >
                {expandedTicket === getTicketId(ticket) ? (
                  <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                    Hide Actions
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                    Show Actions
                  </>
                )}
              </button>

              {expandedTicket === getTicketId(ticket) && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Assign Ticket</label>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Staff ID"
                        id={`mobile-staff-${getTicketId(ticket)}`}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5"
                      />
                      <button
                        onClick={() => handleAssignTicket(
                          getTicketId(ticket), 
                          document.getElementById(`mobile-staff-${getTicketId(ticket)}`).value
                        )}
                        className="bg-green-600 text-white rounded-r-lg px-3 py-2 hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors"
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Assign'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Update Status</label>
                    <div className="flex">
                      <select
                        onChange={(e) => handleStatusChange(getTicketId(ticket), e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5"
                        value={selectedStatuses[getTicketId(ticket)] || ""}
                      >
                        <option value="" disabled>Select Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                      <button
                        onClick={() => handleUpdateStatus(getTicketId(ticket))}
                        className="bg-blue-600 text-white rounded-r-lg px-3 py-2 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                        disabled={!selectedStatuses[getTicketId(ticket)] || loading}
                      >
                        {loading ? 'Loading...' : 'Update'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="bg-gray-100 p-5 rounded-full mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tickets found</h3>
          <p className="text-gray-500 mb-4 text-center">There are currently no support tickets in the system.</p>
        </div>
      )}
    </div>
  );
};

export default MobileTicketCard;
