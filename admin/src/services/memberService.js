import api from './api';

export const registerMember = async (memberData) => {
  try {
    const response = await api.post('/members/register', memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

// Add other member-related API calls here