import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRouteAdmin = ({ element: Component }) => {
    const [isAuthorized, setIsAuthorized] = useState(null); 
    const token = localStorage.getItem('token'); 

    useEffect(() => {
        if (token) {
            axios.get('/api/auth/current-user', {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            })
            .then(response => {
                const userData = response.data;
                console.log(userData);
        
                if (userData.role === 'admin') {
                    setIsAuthorized(true); 
                } else {
                    alert('Unauthorized attempt. The page is only allowed for admins.');
                    setIsAuthorized(false);  
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                alert('Error validating your session. Please log in again.');
                setIsAuthorized(false);  
            });
        } else {
            alert('Unauthorized attempt. Please log in first.');
            setIsAuthorized(false);  
        }
    }, [token]);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    if (isAuthorized === false) {
        return <Navigate to="/login" />;
    }
    return <Component />;
};

export default ProtectedRouteAdmin;
