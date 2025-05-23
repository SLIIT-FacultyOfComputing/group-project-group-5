import api from './api';

const BASE_URL = "http://localhost:8090";

// Ticket API calls
export const addTicket = async (ticketData) => {
  return api.post(`/tickets`, ticketData);
};

export const updateTicketStatus = async (ticketId, status) => {
  return api.put(`/tickets/${ticketId}/status?status=${status}`);
};

export const searchTicketsByStaffId = async (staffId) => {
  return api.get(`/tickets/assigned-to/staff/${staffId}`);
};

export const getTicketsRaisedByStaff = async (staffId) => {
  return api.get(`/tickets/raised-by/staff/${staffId}`);
};

export const getTicketsRaisedByMember = async (memberId) => {
  // This will use the same endpoint but will be interpreted differently on the backend
  return api.get(`/tickets/raised-by/member/${memberId}`);
};

export const getTicketsAssignedToStaff = async (staffId) => {
  return api.get(`/tickets/assigned-to/staff/${staffId}`);
};

export const getAllTickets = async () => {
  return api.get('/tickets');
};

export const filterTicketsByStatus = async (status) => {
  return api.get(`/tickets/filter-by-status?status=${status}`);
};

export const filterTicketsByPriority = async (priority) => {
  return api.get(`/tickets/filter-by-priority?priority=${priority}`);
};

export const getTicketCountBystaffId = async (staffId) => {
  return api.get(`/tickets/count-by-status-staff?status=IN_PROGRESS&staffId=${staffId}`);
};

export const getTicketCountByStatus = async (status) => {
  return api.get(`/tickets/count-by-status?status=${status}`);
};

export const assignTicket = async (ticketId, staffId) => {
  return api.put(`/tickets/${ticketId}/assign?staffId=${staffId}`);
};