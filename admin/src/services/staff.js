import axios from "axios"

const BASE_URL = "http://localhost:8090"

// Staff APIs
export const addStaff = async (staff) => {
  return axios.post(`${BASE_URL}/api/staff`, staff)
}

export const getStaff = async () => {
  return axios.get(`${BASE_URL}/api/staff`)
}

export const getStaffById = async (nic) => {
  return axios.get(`${BASE_URL}/api/staff/${nic}`)
}

export const updateStaff = async (nic, staff) => {
  console.log(`Sending update request to ${BASE_URL}/api/staff/${nic}`, staff)

  const staffData = { ...staff }

  if (staffData.confirmPassword) {
    delete staffData.confirmPassword
  }

  if (staffData.role && typeof staffData.role === "string") {
    staffData.role = staffData.role.toUpperCase()
  }

  if (staffData.startDate && typeof staffData.startDate === "string") {
    const dateObj = new Date(staffData.startDate)
    if (!isNaN(dateObj.getTime())) {
      staffData.startDate = dateObj.toISOString().split("T")[0]
    }
  }

  return axios.put(`${BASE_URL}/api/staff/${nic}`, staffData)
}

export const deleteStaff = async (nic) => {
  return axios.delete(`${BASE_URL}/api/staff/${nic}`)
}

export const searchStaffByName = async (name) => {
  return axios.get(`${BASE_URL}/api/staff/search?name=${name}`)
}