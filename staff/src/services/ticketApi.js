import axios from "axios";

const BASE_URL = "http://localhost:8090";

export const addTicket = async (ticketData) => {
  return axios.post(`${BASE_URL}/api/tickets`, ticketData);
};

export const updateTicketStatus = async (ticketId, status) => {
  return axios.put(`${BASE_URL}/api/tickets/${ticketId}/status?status=${status}`);
};
export const searchTicketsByStaffId = async (staffId) => {
  return axios.get(`${BASE_URL}/api/tickets/assigned-to/staff/${staffId}`);
};

export const getTicketsRaisedByStaff = async (staffId) => {
  return axios.get(`${BASE_URL}/api/tickets/raised-by/staff/${staffId}`);
}

export const getTicketsAssignedToStaff = async (staffId) => {
  return axios.get(`${BASE_URL}/api/tickets/assigned-to/staff/${staffId}`);
}

export const getTicketCountBystaffId = async (staffId) => {
  return axios.get(`${BASE_URL}/api/tickets/count-by-status-staff?status=IN_PROGRESS&staffId=${staffId}`);
}