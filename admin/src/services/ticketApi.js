import axios from "axios";

const BASE_URL = "http://localhost:8090";

export const getAllTickets = async () => {
  return axios.get(`${BASE_URL}/api/tickets/search`);
};

export const getTicketDetails = async (ticketId) => {
  return axios.get(`${BASE_URL}/api/tickets/search?ticketId=${ticketId}`);
};

export const addTicket = async (ticketData) => {
  return axios.post(`${BASE_URL}/api/tickets`, ticketData);
};

export const assignTicket = async (ticketId, staffId) => {
  return axios.put(`${BASE_URL}/api/tickets/${ticketId}/assign`, { staffId });
};

export const updateTicketStatus = async (ticketId, status) => {
  return axios.put(`${BASE_URL}/api/tickets/${ticketId}/status`, { status });
};

export const searchTicketsById = async (ticketId) => {
  return axios.get(`${BASE_URL}/api/tickets/search?ticketId=${ticketId}`);
};

export const searchTicketsByStaffId = async (staffId) => {
  return axios.get(`${BASE_URL}/api/tickets/assigned-to/staff/${staffId}`);
};

export const filterTicketsByStatus = async (status) => {
  return axios.get(`${BASE_URL}/api/tickets/filter-by-status?status=${status}`);
}

export const filterTicketsByPriority = async (priority) => {
  return axios.get(`${BASE_URL}/api/tickets/filter-by-priority?priority=${priority}`);
}
