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
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  // Check if staff is authenticated (token exists and user role is staff, not member)
  const isAuthenticated = token !== null && userRole !== null && userRole !== 'member';
  
  if (!isAuthenticated) {
    // Redirect to staff login if not authenticated
    return <Navigate to="/staff/login" replace />;
  }

  return children;
};

// Component for protected member routes
export const MemberProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  // Check if member is authenticated (token exists and user role is specifically 'member')
  const isAuthenticated = token !== null && userRole === 'member';
  
  if (!isAuthenticated) {
    // Redirect to member login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};
