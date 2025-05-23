import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

// Component for protected admin routes
export const AdminProtectedRoute = ({ children }) => {
  if (!authService.isAdminAuthenticated()) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }
  
  // Check if token is expired
  const token = authService.getToken();
  if (authService.isTokenExpired(token)) {
    // Logout and redirect if token is expired
    authService.logoutAdmin();
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Component for protected staff routes
export const StaffProtectedRoute = ({ children }) => {
  // Check if staff is authenticated (using simple token check for now)
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    // Redirect to staff login if not authenticated
    return <Navigate to="/staff/login" replace />;
  }

  return children;
};

// Component for protected member routes
export const MemberProtectedRoute = ({ children }) => {
  // Check if member is authenticated (using simple token check for now)
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    // Redirect to member login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};
