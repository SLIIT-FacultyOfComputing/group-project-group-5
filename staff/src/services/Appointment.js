import axios from "axios";

const BASE_URL = "http://localhost:8090";

export const bookAppointment = async (appointmentData) => {
  return axios.post(`${BASE_URL}/api/appointments`, appointmentData)
}

export const getAllAppointments = async () => {
  return axios.get(`${BASE_URL}/api/appointments`)
}

export const getAvailableSlots = async () => {
  return axios.get(`${BASE_URL}/api/appointments/slots`)
}

export const getAppointmentsByTrainer = async (trainerId) => {
  return axios.get(`${BASE_URL}/api/appointments/trainer/${trainerId}`)
}

export const getAppointmentsByTrainee = async (traineeId) => {
  return axios.get(`${BASE_URL}/api/appointments/trainee/${traineeId}`)
}

export const updateAppointmentStatus = async (id, status) => {
  return axios.put(`${BASE_URL}/api/appointments/${id}/status?status=${status}`)
}

export const getTrainersByRole = async () => {
  return axios.get(`${BASE_URL}/api/staff?role=TRAINER`)
}

export const getAllMembers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/members`);
    console.log("Members API response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};