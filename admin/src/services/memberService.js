import api from './api';

const BASE_URL = "http://localhost:8090";

// Register a new member
export const registerMember = async (memberData) => {
  try {
    const response = await api.post('/members/register', memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

// Get all members
export const getMembers = async () => {
  try {
    const response = await api.get('/members');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch members";
  }
};

// Get member by ID
export const getMemberById = async (id) => {
  try {
    const response = await api.get(`/members/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch member";
  }
};

// Update member
export const updateMember = async (id, memberData) => {
  try {
    const response = await api.put(`/members/${id}`, memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update member";
  }
};

// Delete member
export const deleteMember = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await api.delete(`/members/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return true for successful deletion (both 200 and 204 status codes)
    return response.status === 200 || response.status === 204;
  } catch (error) {
    console.error('Delete member error:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    } else if (error.response?.status === 404) {
      throw new Error('Member not found');
    } else {
      throw new Error(error.response?.data?.message || "Failed to delete member");
    }
  }
};

// Get member attendance
export const getMemberAttendance = async (id) => {
  try {
    const response = await api.get(`/members/${id}/attendance`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch attendance";
  }
};

// Get member payments
export const getMemberPayments = async (id) => {
  try {
    const response = await api.get(`/members/${id}/payments`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch payments";
  }
};

// Update member status
export const updateMemberStatus = async (id, status) => {
  try {
    const response = await api.patch(`/members/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update member status";
  }
};

// Get member membership details
export const getMemberMembership = async (id) => {
  try {
    const response = await api.get(`/members/${id}/membership`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch membership details";
  }
};

// Update member membership
export const updateMemberMembership = async (id, membershipData) => {
  try {
    const response = await api.put(`/members/${id}/membership`, membershipData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update membership";
  }
};

// Get member profile
export const getMemberProfile = async (id) => {
  try {
    const response = await api.get(`/members/${id}/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch profile";
  }
};

// Update member profile
export const updateMemberProfile = async (id, profileData) => {
  try {
    const response = await api.put(`/members/${id}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update profile";
  }
};

// Search members
export const searchMembers = async (searchTerm) => {
  try {
    const response = await api.get(`/members/search?q=${searchTerm}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to search members";
  }
};

// Get members by status
export const getMembersByStatus = async (status) => {
  try {
    const response = await api.get(`/members/status/${status}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch members by status";
  }
};

// Get members by membership type
export const getMembersByMembershipType = async (membershipType) => {
  try {
    const response = await api.get(`/members/membership/${membershipType}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch members by membership type";
  }
};