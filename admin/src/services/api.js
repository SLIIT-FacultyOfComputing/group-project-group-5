import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8090/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
export * from './equipmentApi';
export * from './maintenanceApi';
export * from './ticketApi';
export * from './memberService';
export * from './staff';
export * from './Appointment';
export * from './exerciseApi';
