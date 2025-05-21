import api from './api';

const BASE_URL = "http://localhost:8090";

export const bookAppointment = async (appointmentData) => {
  return api.post('/api/appointments', appointmentData)
}

export const getAllAppointments = async () => {
  return api.get('/api/appointments');
}

export const getAvailableSlots = async () => {
  return api.get('/api/appointments/slots')
}

export const getAppointmentsByTrainer = async (trainerId) => {
  return api.get(`/api/appointments/trainer/${trainerId}`)
}

export const getAppointmentsByTrainee = async (traineeId) => {
  return api.get(`/api/appointments/trainee/${traineeId}`)
}

export const updateAppointmentStatus = async (id, status) => {
  return api.put(`/api/appointments/${id}/status?status=${status}`)
}

export const getTrainersByRole = async () => {
  return api.get('/api/staff?role=TRAINER')
}

export const getAllMembers = async () => {
  try {
    const response = await api.get('/api/members');
    console.log("Members API response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

export const getAppointmentById = async (id) => {
  return api.get(`/api/appointments/${id}`);
};

export const createAppointment = async (appointmentData) => {
  return api.post('/api/appointments', appointmentData);
};

export const updateAppointment = async (id, appointmentData) => {
  return api.put(`/api/appointments/${id}`, appointmentData);
};

export const deleteAppointment = async (id) => {
  return api.delete(`/api/appointments/${id}`);
};

export const getAppointmentsByMember = async (memberId) => {
  return api.get(`/api/appointments/member/${memberId}`);
};

export const getAppointmentsByStaff = async (staffId) => {
  return api.get(`/api/appointments/staff/${staffId}`);
};