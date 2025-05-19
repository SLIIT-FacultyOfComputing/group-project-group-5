import React from 'react';
import StatusBadge from './StatusBadge';
import TicketDetails from './TicketDetails';

const TicketTable = ({
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
  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="hidden md:block overflow-x-auto rounded-lg mb-0">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-white uppercase bg-gradient-to-r from-rose-700 to-rose-600 shadow-sm">
          <tr>
            <th className="px-6 py-4 font-semibold">ID</th>
            <th className="px-6 py-4 font-semibold">Type</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Priority</th>
            <th className="px-6 py-4 font-semibold">Created</th>
            <th className="px-6 py-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets && tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <React.Fragment key={getTicketId(ticket) || Math.random()}>
                <tr className={`border-b hover:bg-rose-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4 font-medium text-gray-900">{getTicketId(ticket)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {ticket.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatDateOnly(ticket.createdAt)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setExpandedTicket(expandedTicket === getTicketId(ticket) ? null : getTicketId(ticket))}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700 focus:ring-4 focus:ring-rose-300 transition-all duration-200 text-xs flex items-center justify-center"
                    >
                      {expandedTicket === getTicketId(ticket) ? (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                          Hide Details
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          View Details
                        </>
                      )}
                    </button>
                  </td>
                </tr>
                {expandedTicket === getTicketId(ticket) && (
                  <tr>
                    <td colSpan="6" className="px-0 py-0 border-b">
                      <TicketDetails 
                        ticket={ticket}
                        handleStatusChange={handleStatusChange}
                        handleUpdateStatus={handleUpdateStatus}
                        handleAssignTicket={handleAssignTicket}
                        selectedStatuses={selectedStatuses}
                        loading={loading}
                        getTicketId={getTicketId}
                        formatDate={formatDate}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-gray-100 p-5 rounded-full mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No tickets found</h3>
                  <p className="text-gray-500 mb-4">There are currently no support tickets matching your filters.</p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                  >
                    Reset Filters
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
