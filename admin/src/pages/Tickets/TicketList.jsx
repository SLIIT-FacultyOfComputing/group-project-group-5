import React, { useState, useEffect } from 'react';
import { 
  assignTicket, 
  updateTicketStatus, 
  filterTicketsByStatus, 
  filterTicketsByPriority,
  getAllTickets
} from '../../services/api';
import Modal from '../../components/Modal';
import StatusChangePreview from '../../components/TicketList/StatusChangePreview';
import FilterButtons from '../../components/TicketList/FilterButtons';
import TicketTable from '../../components/TicketList/Admin_TicketTable';
import MobileTicketCard from '../../components/TicketList/Admin_MobileTicketCard';

const TicketList = () => {
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [initialTickets, setInitialTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);
  const [modalConfirmText, setModalConfirmText] = useState('Confirm');
  const [modalType, setModalType] = useState('info');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllTickets();
      const ticketData = Array.isArray(response.data) ? response.data : [];
      setTickets(ticketData);
      setInitialTickets(ticketData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to load tickets. Please try again later.');
      setTickets([]);
      setInitialTickets([]);
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

  const getRaisedByInfo = (ticket) => {
    const name = ticket.raisedByName || 'Unknown';
    const id = ticket.raisedById || 'N/A';
    const type = ticket.raisedByType || 'N/A';
    
    return `${name} (${type} ID: ${id})`;
  };

  const getAssignedToInfo = (ticket) => {
    if (!ticket.assignedToId && !ticket.assignedToName) {
      return 'Not assigned';
    }
    
    const name = ticket.assignedToName || 'Unknown';
    const id = ticket.assignedToId || 'N/A';
    
    return `${name} (Staff ID: ${id})`;
  };

  const getStatusCounts = () => {
    const counts = {
      ALL: initialTickets?.length || 0,
      OPEN: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      CLOSED: 0
    };
    
    initialTickets?.forEach(ticket => {
      if (counts[ticket.status] !== undefined) {
        counts[ticket.status]++;
      }
    });
    
    return counts;
  };
  
  const getPriorityCounts = () => {
    const counts = {
      ALL: initialTickets?.length || 0,
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0
    };
    
    initialTickets?.forEach(ticket => {
      if (counts[ticket.priority] !== undefined) {
        counts[ticket.priority]++;
      }
    });
    
    return counts;
  };

  useEffect(() => {
    applyFilters();
  }, [statusFilter, priorityFilter, initialTickets]);

  const applyFilters = async () => {
    setLoading(true);
    try {
      let filteredTickets = [...initialTickets];
      
      if (statusFilter !== 'ALL') {
        const response = await filterTicketsByStatus(statusFilter);
        filteredTickets = response.data;
      }
      
      if (priorityFilter !== 'ALL') {
        if (statusFilter === 'ALL') {
          const response = await filterTicketsByPriority(priorityFilter);
          filteredTickets = response.data;
        } else {
          filteredTickets = filteredTickets.filter(ticket => ticket.priority === priorityFilter);
        }
      }
      
      setTickets(filteredTickets);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setTickets(initialTickets);
  };

  const resetAll = () => {
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setTickets(initialTickets);
  };

  const showConfirmationModal = (title, message, action, confirmText = 'Confirm', type = 'warning') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalAction(() => action);
    setModalConfirmText(confirmText);
    setModalType(type);
    setModalOpen(true);
  };

  const handleAssignTicket = async (ticketId, staffId) => {
    if (!staffId) return;
    
    showConfirmationModal(
      'Confirm Assignment',
      `Are you sure you want to assign ticket #${ticketId} to staff member ${staffId}?`,
      async () => {
        try {
          setLoading(true);
          await assignTicket(ticketId, staffId);
          fetchTickets();
        } catch (error) {
          console.error('Error assigning ticket:', error);
        } finally {
          setLoading(false);
        }
      },
      'Assign Ticket',
      'warning'
    );
  };

  const handleStatusChange = (ticketId, status) => {
    setSelectedStatuses(prev => ({
      ...prev,
      [ticketId]: status
    }));
  };

  const handleUpdateStatus = async (ticketId) => {
    const status = selectedStatuses[ticketId];
    if (!status) return;
    
    showConfirmationModal(
      'Confirm Status Update',
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Are you sure you want to update the status of ticket #{ticketId} to {status.replace(/_/g, " ")}?</p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <StatusChangePreview currentStatus={status} />
        </div>
      </div>,
      async () => {
        try {
          setLoading(true);
          await updateTicketStatus(ticketId, status);
          fetchTickets();
        } catch (error) {
          console.error('Error updating status:', error);
        } finally {
          setLoading(false);
        }
      },
      'Update Status',
      'warning'
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        

        {error && (
          <div className="mb-6 text-rose-600 p-4 bg-rose-50 border-l-4 border-rose-600 rounded-md flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-white bg-opacity-30 p-2 rounded-lg mr-3 shadow-inner">
                <svg className="w-6 h-6 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                Tickets
              </h1>
            </div>
            <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white border-opacity-20">
              <svg className="w-5 h-5 text-red opacity-80 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              <span className="text-red font-medium">Total: {initialTickets?.length || 0} tickets</span>
            </div>
          </div>

          {/* Status Filter Buttons */}
          <FilterButtons 
            type="status" 
            currentFilter={statusFilter} 
            setFilter={setStatusFilter} 
            counts={getStatusCounts()} 
          />

          {/* Priority Filter Buttons */}
          <FilterButtons 
            type="priority" 
            currentFilter={priorityFilter} 
            setFilter={setPriorityFilter} 
            counts={getPriorityCounts()} 
          />

          {/* Loading indicator */}
          {loading && (
            <div className="p-4 flex justify-center">
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading tickets...</span>
              </div>
            </div>
          )}

          {/* Desktop Table View */}
          <TicketTable
            tickets={tickets}
            expandedTicket={expandedTicket}
            setExpandedTicket={setExpandedTicket}
            handleStatusChange={handleStatusChange}
            handleUpdateStatus={handleUpdateStatus}
            handleAssignTicket={handleAssignTicket}
            selectedStatuses={selectedStatuses}
            loading={loading}
            resetFilters={resetFilters}
            formatDate={formatDate}
            getTicketId={getTicketId}
          />

          {/* Mobile Card View */}
          <MobileTicketCard
            tickets={tickets}
            expandedTicket={expandedTicket}
            setExpandedTicket={setExpandedTicket}
            handleStatusChange={handleStatusChange}
            handleUpdateStatus={handleUpdateStatus}
            handleAssignTicket={handleAssignTicket}
            selectedStatuses={selectedStatuses}
            loading={loading}
            resetFilters={resetFilters}
            formatDate={formatDate}
            getTicketId={getTicketId}
          />
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

export default TicketList;