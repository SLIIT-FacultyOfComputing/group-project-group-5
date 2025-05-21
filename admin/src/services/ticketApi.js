import api from './api';

const BASE_URL = "http://localhost:8090";

// Ticket API calls
export const addTicket = async (ticketData) => {
  return api.post(`/api/tickets`, ticketData);
};

export const updateTicketStatus = async (ticketId, status) => {
  return api.put(`/api/tickets/${ticketId}/status?status=${status}`);
};

export const searchTicketsByStaffId = async (staffId) => {
  return api.get(`/api/tickets/assigned-to/staff/${staffId}`);
};

export const getTicketsRaisedByStaff = async (staffId) => {
  return api.get(`/api/tickets/raised-by/staff/${staffId}`);
};

export const getTicketsAssignedToStaff = async (staffId) => {
  return api.get(`/api/tickets/assigned-to/staff/${staffId}`);
};

export const getAllTickets = async () => {
  return api.get('/api/tickets');
};

export const filterTicketsByStatus = async (status) => {
  return api.get(`/api/tickets/filter-by-status?status=${status}`);
};

export const filterTicketsByPriority = async (priority) => {
  return api.get(`/api/tickets/filter-by-priority?priority=${priority}`);
};

export const getTicketCountBystaffId = async (staffId) => {
  return api.get(`/api/tickets/count-by-status-staff?status=IN_PROGRESS&staffId=${staffId}`);
};

export const assignTicket = async (ticketId, staffId) => {
  return api.put(`/api/tickets/${ticketId}/assign?staffId=${staffId}`);
};