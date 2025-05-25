import api from './api';

export const addEquipment = async (equipment) => {
  return api.post('/equipment', equipment);
};

export const getEquipment = async () => {
  return api.get('/equipment');
};

export const getEquipmentWithDeleted = async () => {
  return api.get('/equipment/get-all');
}

export const getEquipmentById = async (id) => {
  return api.get(`/equipment/${id}`);
};

export const updateEquipment = async (id) => {
  return api.put(`/equipment/${id}`);
};

export const deleteEquipment = async (id) => {
  return api.delete(`/equipment/${id}`);
};

export const updateEquipmentStatus = async (id, status) => {
  return api.put(`/equipment/${id}/status?status=${status}`);
};

export const updateEquipmentMaintenanceDate = async (id, maintenanceDate) => {
  return api.put(`/equipment/${id}/Maintenance?maintenanceDate=${maintenanceDate}`);
};

export const searchEquipment = async (search) => {
  return api.get(`/equipment/search?Search=${search}`);
}

export const searchEquipmentByName = async (name) => {
  return api.get(`/equipment/search-by-name?name=${name}`);
};

export const filterEquipmentByStatus = async (status) => {
  return api.get(`/equipment/filter-by-status?status=${status}`);
};

