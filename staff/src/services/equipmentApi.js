import axios from "axios";

const BASE_URL = "http://localhost:8090";

export const getEquipment = async () => {
  return axios.get(`${BASE_URL}/api/equipment`);
};

export const getEquipmentWithDeleted = async () => {
  return axios.get(`${BASE_URL}/api/equipment/get-all`);
}

export const getEquipmentById = async (id) => {
  return axios.get(`${BASE_URL}/api/equipment/${id}`);
};

export const searchEquipment = async (search) => {
  return axios.get(`${BASE_URL}/api/equipment/search?Search=${search}`);
}

export const filterEquipmentByStatus = async (status) => {
  return axios.get(`${BASE_URL}/api/equipment/filter-by-status?status=${status}`);
};
