import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({ element: Component, roles = [] }) => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      alert('Unauthorized attempt. Please log in first.');
      return <Navigate to="/login" />;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role; 
  
      if (!roles.includes(userRole)) {
        alert('Unauthorized attempt. You do not have permission to access this page.');
        return <Navigate to="/" />; 
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      alert('Invalid token. Please log in again.');
      return <Navigate to="/login" />;
    }
  
    return <Component />;
};

export default ProtectedRoute;
