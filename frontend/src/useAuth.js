import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            alert('Unauthorized attempt. Please log in first.');
            navigate('/login');
        }
    }, [navigate]);

    return isAuthenticated;
};

export default useAuth;
