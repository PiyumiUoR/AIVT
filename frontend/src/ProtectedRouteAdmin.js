import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRouteAdmin = ({ element: Component }) => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      alert('Unauthorized attempt. Please log in first.');
      return <Navigate to="/login" />;
    }
    
    else {
      axios.get('/api/auth/current-user', {
          headers: {
              Authorization: `Bearer ${token}` 
          }
      })
      .then(response => {
          const userData = response.data;
          console.log(userData);
          if (userData.role !== 'admin') {
            alert('Unauthorized attempt. The page is only allowed for admins');
            return <Navigate to="/login" />;
          }           
      })
      .catch(error => {
          console.error('Error fetching user data:', error);
      });
    }
    return <Component />;
};

export default ProtectedRouteAdmin;
