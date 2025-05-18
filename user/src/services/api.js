import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Direct URL instead of relying on proxy

export const fetchRoutines = async (memberId) => {
    try {
        console.log(`Fetching routines for memberId: ${memberId} from ${API_URL}/routines/${memberId}`);
        const response = await axios.get(`${API_URL}/routines/${memberId}`);
        console.log('Raw Response:', response);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching routines:', error.response || error.message);
        throw error;
    }
};

export const fetchRoutineDetails = async (routineId) => {
    try {
        console.log(`Fetching routine details for routineId: ${routineId} from ${API_URL}/routines/details/${routineId}`);
        const response = await axios.get(`${API_URL}/routines/details/${routineId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching routine details:', error.response || error.message);
        throw error;
    }
};

export const logSession = async (sessionData) => {
    try {
        console.log('Logging session:', sessionData);
        const response = await axios.post(`${API_URL}/sessions`, sessionData);
        return response.data;
    } catch (error) {
        console.error('Error logging session:', error.response || error.message);
        throw error;
    }
};