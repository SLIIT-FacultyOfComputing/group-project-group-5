import axios from 'axios';

const API_URL = 'http://localhost:8090/api';

export const fetchMembers = async () => {
    try {
        const response = await axios.get(`${API_URL}/members`);
        return response.data;
    } catch (error) {
        console.error('Error fetching members:', error);
        throw error;
    }
};

export const fetchExercises = async (name, primaryMuscleGroup, equipment ) => {
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

export const fetchRoutineDetails = async (routineId) => {
    try {
        const response = await axios.get(`${API_URL}/routines/details/${routineId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching routine details:', error);
        throw error;
    }
};

export const renameRoutine = async (routineId, name) => {
    try {
        const response = await axios.put(`${API_URL}/routines/${routineId}/name`, { name });
        return response.data;
    } catch (error) {
        console.error('Error renaming routine:', error);
        throw error;
    }
};

export const deleteRoutine = async (routineId) => {
    try {
        await axios.delete(`${API_URL}/routines/${routineId}`);
    } catch (error) {
        console.error('Error deleting routine:', error);
        throw error;
    }
};

export const addExerciseToRoutine = async (routineId, assignment) => {
    try {
        const response = await axios.post(`${API_URL}/routines/${routineId}/exercises`, assignment);
        return response.data;
    } catch (error) {
        console.error('Error adding exercise to routine:', error);
        throw error;
    }
};

export const removeExerciseFromRoutine = async (routineId, exerciseId) => {
    try {
        await axios.delete(`${API_URL}/routines/${routineId}/exercises/${exerciseId}`);
    } catch (error) {
        console.error('Error removing exercise from routine:', error);
        throw error;
    }
};