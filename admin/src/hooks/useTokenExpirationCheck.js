import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * A hook to periodically check if the authentication token is valid
 * and automatically log out if expired
 */
const useTokenExpirationCheck = (interval = 60000) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check token
    const checkToken = () => {
      // Check if we have an admin token
      if (authService.isAdminAuthenticated()) {
        const token = authService.getToken();
          // If token is expired, log out
        if (authService.isTokenExpired(token)) {
          console.log('Admin token expired, logging out');
          authService.logoutAdmin();
          window.location.href = '/admin/login';
        }
      }
      
      // Similar checks could be added for other user types
    };

    // Perform initial check
    checkToken();
    
    // Set up interval to check periodically
    const intervalId = setInterval(checkToken, interval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [navigate, interval]);
};

export default useTokenExpirationCheck;
