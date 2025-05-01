import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchMembers = async () => {
    try {
        const response = await axios.get(`${API_URL}/members`);
        return response.data;
    } catch (error) {
        console.error('Error fetching members:', error);
        throw error;
    }
};

export const fetchExercises = async (name, primaryMuscleGroup, equipment) => {
    try {
        const params = {};
        if (name) params.name = name;
        if (primaryMuscleGroup) params.primaryMuscleGroup = primaryMuscleGroup;
        if (equipment) params.equipment = equipment;

        const response = await axios.get(`${API_URL}/exercises`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching exercises:', error);
        throw error;
    }
};

export const createExercise = async (exercise) => {
    try {
        const response = await axios.post(`${API_URL}/exercises`, exercise);
        return response.data;
    } catch (error) {
        console.error('Error creating exercise:', error);
        throw error;
    }
};

export const updateExercise = async (id, exercise) => {
    try {
        const response = await axios.put(`${API_URL}/exercises/${id}`, exercise);
        return response.data;
    } catch (error) {
        console.error('Error updating exercise:', error);
        throw error;
    }
};

export const deleteExercise = async (id) => {
    try {
        await axios.delete(`${API_URL}/exercises/${id}`);
    } catch (error) {
        console.error('Error deleting exercise:', error);
        throw error;
    }
};

export const createRoutine = async (routine) => {
    try {
        const response = await axios.post(`${API_URL}/routines`, routine);
        return response.data;
    } catch (error) {
        console.error('Error creating routine:', error);
        throw error;
    }
};

export const fetchRoutines = async (memberId) => {
    try {
        const response = await axios.get(`${API_URL}/routines/${memberId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching routines:', error);
        throw error;
    }
};