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