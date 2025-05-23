import React, { useState, useEffect } from 'react';
import { getTicketsRaisedByStaff, getTicketsRaisedByMember } from '../../services/ticketApi';
import TicketTable from '../../components/TicketList/Staff_TicketTable';
import MobileTicketCard from '../../components/TicketList/Staff_MobileTicketCard';
import Pagination from '../../components/Pagination';

const TicketsByRaiserPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [userInfo, setUserInfo] = useState({ id: '', name: '', role: '' });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
    const fetchCurrentUserTickets = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const userRole = localStorage.getItem('userRole');
        
        if (!userId) {
          setError('You must be logged in to view your tickets');
          setLoading(false);
          return;
        }
        
        setUserInfo({ 
          id: userId, 
          name: userName || 'User', 
          role: userRole || ''
        });
        
        // Use the appropriate API endpoint based on user role
        const isMember = userRole?.toLowerCase() === 'member';
        const response = isMember 
          ? await getTicketsRaisedByMember(userId)
          : await getTicketsRaisedByStaff(userId);

        const transformedData = Array.isArray(response.data) ? 
          response.data.map(item => ({
            id: item.ticketId,
            ticketId: item.ticketId,
            type: item.ticket.type,
            description: item.ticket.description,
            status: item.ticket.status,
            priority: item.ticket.priority,
            createdAt: item.ticket.createdAt,
            updatedAt: item.ticket.updatedAt,
            raisedByName: isMember 
              ? (item.member ? `${item.member.firstName} ${item.member.lastName}` : userName || 'Member')
              : (item.staff ? item.staff.name : userName || 'Staff Member'),
            raisedById: userId,
            raisedByType: isMember ? 'MEMBER' : 'STAFF'
          })) : [];

        setTickets(transformedData);
        if (transformedData.length === 0) {
          setError('You have not raised any tickets yet');
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError(`Failed to fetch tickets. ${err.response?.data?.message || err.message || 'Please try again later.'}`);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUserTickets();
  }, []);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [tickets.length]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const getTicketId = (ticket) => ticket.id || ticket.ticketId;

  const handleStatusChange = (ticketId, status) => {
    setSelectedStatuses(prev => ({
      ...prev,
      [ticketId]: status
    }));
  };

  const handleUpdateStatus = async () => {  };

  const handleAssignTicket = async () => {  };
  
  // Pagination handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Get paginated tickets
  const getPaginatedTickets = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tickets.slice(startIndex, endIndex);
  };
  
  const paginatedTickets = getPaginatedTickets();
  const totalPages = Math.max(1, Math.ceil(tickets.length / itemsPerPage));

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-white bg-opacity-30 p-2 rounded-lg mr-3 shadow-inner">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"></path>
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                My Tickets
              </h1>
            </div>
            <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white border-opacity-20">
              <svg className="w-5 h-5 text-black opacity-80 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              <span className="text-black font-medium">Total: {tickets?.length || 0} tickets</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 text-rose-600 p-4 bg-rose-50 border-l-4 border-rose-600 rounded-md flex items-start mx-4 my-4">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="p-4 flex justify-center">
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading your tickets...</span>
              </div>
            </div>
          )}

          {/* Results - using the same components as TicketList */}
          {!loading && tickets.length > 0 && (
            <>
              <div className="p-4 bg-rose-50 border-l-4 border-rose-500 mx-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-rose-700">
                      Showing your tickets: 
                      <span className="font-semibold ml-1">
                        {userInfo.name} (ID: {userInfo.id})
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Table View */}
              <TicketTable
                tickets={paginatedTickets}
                expandedTicket={expandedTicket}
                setExpandedTicket={setExpandedTicket}
                handleStatusChange={handleStatusChange}
                handleUpdateStatus={handleUpdateStatus}
                handleAssignTicket={handleAssignTicket}
                selectedStatuses={selectedStatuses}
                loading={loading}
                formatDate={formatDate}
                getTicketId={getTicketId}
              />

              {/* Mobile Card View */}
              <MobileTicketCard
                tickets={paginatedTickets}
                expandedTicket={expandedTicket}
                setExpandedTicket={setExpandedTicket}
                handleStatusChange={handleStatusChange}
                handleUpdateStatus={handleUpdateStatus}
                handleAssignTicket={handleAssignTicket}
                selectedStatuses={selectedStatuses}
                loading={loading}
                formatDate={formatDate}
                getTicketId={getTicketId}
              />
              
              {/* Pagination - Bottom only */}
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={tickets.length}
              />
            </>
          )}

          {/* Empty state */}
          {!loading && tickets.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 p-5 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No tickets found</h3>
              <p className="text-gray-500 mb-4 text-center">
                You haven't raised any tickets yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsByRaiserPage;
