import axios from "axios";

const BASE_URL = "http://localhost:8090";


export const addEquipment = async (equipment) => {
  return axios.post(`${BASE_URL}/api/equipment`,equipment);
};

export const getEquipment = async () => {
  return axios.get(`${BASE_URL}/api/equipment`);
};

export const getEquipmentById = async (id) => {
  return axios.get(`${BASE_URL}/api/equipment/${id}`);
};

export const updateEquipment = async (id) => {
  return axios.put(`${BASE_URL}/api/equipment/${id}`);
};

export const deleteEquipment = async (id) => {
    return axios.delete(`${BASE_URL}/api/equipment/${id}`);
};

export const updateEquipmentStatus = async (id, status) => {
  return axios.put(`${BASE_URL}/api/equipment/${id}/status?status=${status}`);
};

export const updateEquipmentMaintenanceDate = async (id, maintenanceDate) => {
  return axios.put(`${BASE_URL}/api/equipment/${id}/Maintenance?maintenanceDate=${maintenanceDate}`);
};

export const searchEquipmentByName = async (search) => {
  return axios.get(`${BASE_URL}/api/equipment/search?Search=${search}`);
}

export const addMaintenanceSchedule = async (maintenanceSchedule) => {
  return axios.post(`${BASE_URL}/api/maintenance-schedule`, maintenanceSchedule);
}

export const getMaintenanceSchedule = async () => {
  return axios.get(`${BASE_URL}/api/maintenance-schedule`);
}

export const getMaintenanceScheduleById = async (id) => {
  return axios.get(`${BASE_URL}/api/maintenance-schedule/${id}`);
}

export const deleteMaintenanceSchedule = async (id) => {
  return axios.delete(`${BASE_URL}/api/maintenance-schedule/${id}`);
}

export const searchMaintenanceSchedule = async (search) => {
  return axios.get(`${BASE_URL}/api/maintenance-schedule/search?search=${search}`);
};702

export const updateMaintenanceDate = async (id, maintenanceDate) => {
  return axios.put(`${BASE_URL}/api/maintenance-schedule/${id}/Maintenance?maintenanceDate=${maintenanceDate}`);
}

export const updateMaintenanceStatus = async (id, status) => {
  return axios.put(`${BASE_URL}/api/maintenance-schedule/${id}/status?status=${status}`);
}

export const updateMaintenanceCost = async (id, maintenanceCost) => {
  return axios.put(`${BASE_URL}/api/maintenance-schedule/${id}/cost?cost=${maintenanceCost}`);
}

export const updateMaintenanceTechnician = async (id, technician) => {
  return axios.put(`${BASE_URL}/api/maintenance-schedule/${id}/technician?technician=${technician}`);
}

export const updateMaintenanceDescription = async (id, description) => {
  return axios.put(`${BASE_URL}/api/maintenance-schedule/${id}/description?description=${description}`);
}