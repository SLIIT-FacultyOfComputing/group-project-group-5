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

// Fix the updateStaff function to properly send the data to the backend
export const updateStaff = async (nic, staff) => {
  console.log(`Sending update request to ${BASE_URL}/api/staff/${nic}`, staff)

  // Create a copy of the staff object to avoid modifying the original
  const staffData = { ...staff }

  // Remove confirmPassword as it's not needed for the backend
  if (staffData.confirmPassword) {
    delete staffData.confirmPassword
  }

  // Convert role to enum string if it's not already
  if (staffData.role && typeof staffData.role === "string") {
    staffData.role = staffData.role.toUpperCase()
  }

  // Convert date string to proper format if needed
  if (staffData.startDate && typeof staffData.startDate === "string") {
    // Ensure date is in YYYY-MM-DD format
    const dateObj = new Date(staffData.startDate)
    if (!isNaN(dateObj.getTime())) {
      staffData.startDate = dateObj.toISOString().split("T")[0]
    }
  }

  // Use PUT request to update the staff member
  return axios.put(`${BASE_URL}/api/staff/${nic}`, staffData)
}

export const deleteStaff = async (nic) => {
  return axios.delete(`${BASE_URL}/api/staff/${nic}`)
}

export const searchStaffByName = async (name) => {
  return axios.get(`${BASE_URL}/api/staff/search?name=${name}`)
}
