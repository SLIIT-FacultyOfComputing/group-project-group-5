// This service handles authentication-related functionality including token management and validation
const authService = {
    // Login admin and store tokens and data
    loginAdmin: (adminData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminData', JSON.stringify(adminData));
        localStorage.setItem('userType', 'admin');
    },

    // Check if user is authenticated as admin
    isAdminAuthenticated: () => {
        const token = localStorage.getItem('adminToken');
        const userType = localStorage.getItem('userType');
        return !!token && userType === 'admin';
    },

    // Get admin data
    getAdminData: () => {
        const adminData = localStorage.getItem('adminData');
        if (adminData) {
            try {
                return JSON.parse(adminData);
            } catch (error) {
                console.error('Error parsing admin data:', error);
                return null;
            }
        }
        return null;
    },    // Logout admin
    logoutAdmin: () => {
        // Clear all localStorage items related to authentication
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        localStorage.removeItem('userType');
        
        // Add a small delay to ensure localStorage is cleared
        return new Promise(resolve => {
            setTimeout(resolve, 50);
        });
    },

    // Get token for API requests
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Check if token is expired
    isTokenExpired: (token) => {
        if (!token) return true;
        
        try {
            // Get the expiration time from the token
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map(c => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join('')
            );
            const { exp } = JSON.parse(jsonPayload);
            
            // Check if the token is expired
            const currentTime = Date.now() / 1000;
            return exp < currentTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }
};

export default authService;
