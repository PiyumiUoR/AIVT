import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteReporter = ({ element: Component }) => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      alert('Unauthorized attempt. Please log in first.');
      return <Navigate to="/login" />;
    }
  
    return <Component />;
};

export default ProtectedRouteReporter;
