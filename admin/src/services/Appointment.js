import api from './api';

const BASE_URL = "http://localhost:8090";

export const bookAppointment = async (appointmentData) => {
  return api.post('/appointments', appointmentData)
}

export const getAllAppointments = async () => {
  return api.get('/appointments');
}

export const getAvailableSlots = async () => {
  return api.get('/appointments/slots')
}

export const getAppointmentsByTrainer = async (trainerId) => {
  return api.get(`/appointments/trainer/${trainerId}`)
}

export const getAppointmentsByTrainee = async (traineeId) => {
  try {
    const response = await api.get(`/appointments/trainee/${traineeId}`);
    console.log('API response from getAppointmentsByTrainee:', response);
    return response;
  } catch (error) {
    console.error('Error in getAppointmentsByTrainee:', error);
    throw error;
  }
}

export const updateAppointmentStatus = async (id, status) => {
  return api.put(`/appointments/${id}/status?status=${status}`)
}

export const getTrainersByRole = async () => {
  return api.get('/staff?role=TRAINER')
}

export const getAllMembers = async () => {
  try {
    const response = await api.get('/members');
    console.log("Members API response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

export const getAppointmentById = async (id) => {
  return api.get(`/appointments/${id}`);
};

export const createAppointment = async (appointmentData) => {
  return api.post('/appointments', appointmentData);
};

export const updateAppointment = async (id, appointmentData) => {
  return api.put(`/appointments/${id}`, appointmentData);
};

export const deleteAppointment = async (id) => {
  return api.delete(`/appointments/${id}`);
};

export const getAppointmentsByMember = async (memberId) => {
  return api.get(`/appointments/member/${memberId}`);
};

export const getAppointmentsByStaff = async (staffId) => {
  return api.get(`/appointments/staff/${staffId}`);
};