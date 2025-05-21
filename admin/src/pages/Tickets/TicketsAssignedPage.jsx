import React, { useState, useEffect } from 'react';
import { searchTicketsByStaffId, updateTicketStatus } from '../../services/ticketApi';
import TicketTable from '../../components/TicketList/Staff_TicketTable';
import MobileTicketCard from '../../components/TicketList/Staff_MobileTicketCard';
import Modal from '../../components/Modal';
import StatusChangePreview from '../../components/TicketList/StatusChangePreview';
import Pagination from '../../components/Pagination';

const TicketsAssignedPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);
  const [modalConfirmText, setModalConfirmText] = useState('Confirm');
  const [modalType, setModalType] = useState('info');

  useEffect(() => {
    const staffId = localStorage.getItem('userId');
    
    if (staffId) {
      fetchTicketsForStaff(staffId);
    } else {
      setLoading(false);
      setError('User ID not found. Please log in again.');
    }
  }, []);

  // Reset to first page when tickets change
  useEffect(() => {
    setCurrentPage(1);
  }, [tickets.length]);

  const fetchTicketsForStaff = async (staffId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchTicketsByStaffId(staffId);

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
          assignedToId: staffId,
          assignedToName: item.staff?.name || 'Unknown',
          staffRole: item.staff?.role || 'N/A',
          staffPhone: item.staff?.phone || 'N/A',
          raisedByMember: item.member ? true : false,
          raisedByName: item.member?.name || (item.staff?.name || 'Unknown'),
          raisedById: item.member?.id || staffId,
        })) : [];

      setTickets(transformedData);
      if (transformedData.length === 0) {
        setError(`No tickets assigned to you`);
      }
    } catch (err) {
      console.error('Error fetching assigned tickets:', err);
      setError(`Failed to fetch tickets. ${err.response?.data?.message || err.message || 'Please try again later.'}`);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

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
  
  const showConfirmationModal = (title, message, action, confirmText = 'Confirm', type = 'warning') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalAction(() => action);
    setModalConfirmText(confirmText);
    setModalType(type);
    setModalOpen(true);
  };
  
  const handleUpdateStatus = async (ticketId) => {
    const newStatus = selectedStatuses[ticketId];
    if (!newStatus) return;
    
    showConfirmationModal(
      'Confirm Status Update',
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Are you sure you want to update the status of ticket #{ticketId} to {newStatus.replace(/_/g, " ")}?</p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <StatusChangePreview currentStatus={newStatus} />
        </div>
      </div>,
      async () => {
        try {
          setUpdating(true);
          await updateTicketStatus(ticketId, newStatus);
          
          setTickets(tickets.map(ticket => 
            getTicketId(ticket) === ticketId 
              ? { ...ticket, status: newStatus }
              : ticket
          ));
          
          setModalOpen(false);
          setUpdateSuccess(`Ticket #${ticketId} status updated to ${newStatus.replace('_', ' ')}`);
          
          setTimeout(() => {
            setUpdateSuccess(null);
          }, 3000);
          
        } catch (err) {
          console.error('Error updating ticket status:', err);
          setModalOpen(false);
          setError(`Failed to update ticket status. ${err.response?.data?.message || err.message || 'Please try again later.'}`);
          
          setTimeout(() => {
            setError(null);
          }, 3000);
        } finally {
          setUpdating(false);
        }
      },
      'Update Status',
      'warning'
    );
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Get paginated tickets
  const getPaginatedTickets = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tickets.slice(startIndex, endIndex);
  };

  const paginatedTickets = getPaginatedTickets();
  const totalPages = Math.max(1, Math.ceil(tickets.length / itemsPerPage));
  const staffName = tickets.length > 0 ? tickets[0].assignedToName : localStorage.getItem('userName') || 'your';
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-white bg-opacity-30 p-2 rounded-lg mr-3 shadow-inner">
                <svg className="w-6 h-6 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                My Assigned Tickets
              </h1>
            </div>
            <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white border-opacity-20">
              <svg className="w-5 h-5 text-red opacity-80 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              <span className="text-reed font-medium">Total: {tickets?.length || 0} tickets</span>
            </div>
          </div>

          {/* Success Message */}
          {updateSuccess && (
            <div className="mb-6 text-green-600 p-4 bg-green-50 border-l-4 border-green-600 rounded-md flex items-start mx-4 my-4">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{updateSuccess}</span>
            </div>
          )}

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

          {/* Results */}
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
                      Showing tickets assigned to: 
                      <span className="font-semibold ml-1">
                        {staffName}
                        {tickets[0].staffRole && ` - ${tickets[0].staffRole}`}
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
                selectedStatuses={selectedStatuses}
                loading={updating} 
                formatDate={formatDate}
                getTicketId={getTicketId}
                isReadOnly={false}
                showUpdateStatus={true}
              />

              {/* Mobile Ticket Card View*/}
              <MobileTicketCard
                tickets={paginatedTickets}
                expandedTicket={expandedTicket}
                setExpandedTicket={setExpandedTicket}
                handleStatusChange={handleStatusChange}
                handleUpdateStatus={handleUpdateStatus}
                selectedStatuses={selectedStatuses}
                loading={updating} 
                formatDate={formatDate}
                getTicketId={getTicketId}
                isReadOnly={false}
                showUpdateStatus={true} 
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
                You don't have any tickets assigned to you at this time.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={modalAction}
        title={modalTitle}
        message={modalMessage}
        confirmText={modalConfirmText}
        type={modalType}
        size="md"
        showCancel={true}
      />
    </div>
  );
};

export default TicketsAssignedPage;
