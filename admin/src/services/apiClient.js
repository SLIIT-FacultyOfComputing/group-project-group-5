import axios from 'axios';
import authService from './authService';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:8090/api',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    // Get the token from authService
    const token = authService.getToken();
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if error is due to an unauthorized request (401)
    if (error.response && error.response.status === 401) {
      // If we're not on the login page, log the user out
      if (!window.location.pathname.includes('/login')) {
        console.log('Token expired or invalid. Logging out...');
        
        // Determine which type of user is logged in and log them out
        if (authService.isAdminAuthenticated()) {
          authService.logoutAdmin();
          window.location.href = '/admin/login'; // Redirect to admin login
        } else {
          // Handle other types of users if needed
          localStorage.removeItem('token');
          window.location.href = '/login'; // Redirect to main login
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
