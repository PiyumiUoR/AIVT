import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; 
import axios from 'axios';

const Header = ({ scrollToWelcome }) => {
    const [searchQuery, setSearchQuery] = useState(''); 
    const [searchResults, setSearchResults] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const syncTokenState = useCallback(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/api/auth/current-user', {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            })
            .then(response => {
                const userData = response.data;
                setUser(userData); 
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
            setIsLoggedIn(true);
        } else {
            setUser(null);
            setIsLoggedIn(false);
        }
    }, []);    

    useEffect(() => {
        syncTokenState();
    }, [syncTokenState]);

    useEffect(() => {
        const handleStorageChange = () => {
            syncTokenState();
        };
    
        window.addEventListener('storage', handleStorageChange);
    
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [syncTokenState]);    

    const handleLogout = () => {
        if (isLoggedIn) { 
            localStorage.removeItem('token');  
            localStorage.removeItem('user'); 
            setIsLoggedIn(false);
            setUser(null);
            window.location.reload();
            syncTokenState(); 
            navigate('/login');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); 
    };

    const validateSearchQuery = (query) => {
        const regex = /^[a-zA-Z0-9 ]*$/;
        return regex.test(query);
    };

    const sanitizeInput = (input) => {
        return input.replace(/<[^>]*>/g, ''); 
    };

    const sanitizeHtml = (input) => {
        const element = document.createElement('div');
        element.innerText = input;
        return element.innerHTML;
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    
        let sanitizedQuery = sanitizeInput(searchQuery); 
        if (sanitizedQuery.trim()) {
            if (!validateSearchQuery(sanitizedQuery)) {
                alert('Invalid search query. Please use only letters and numbers.');
                return;
            }
    
            navigate(`/vulnerabilities/search-results?query=${encodeURIComponent(sanitizedQuery)}`);
        }
    };
    

    const handleResultClick = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="logo-container">
                <Link to="/" className="logo-link">
                    <h1 className="logo">AIVT</h1>
                </Link>
                </div>
                <form className="search-bar" onSubmit={handleSearchSubmit}>
                    <input
                        type="search"
                        placeholder="Search vulnerability"
                        className="vulnerability-search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <span className="search-icon" onClick={handleSearchSubmit}>
                        <i className="fas fa-search"></i>
                    </span>
                </form>
                <div className="header-icons">
                    <Link to="/" className="icon home-icon" onClick={scrollToWelcome}>
                        <i className="fas fa-home"></i> 
                        <span className="hover-text">Home</span>
                    </Link>
                    <Link to="/vulnerabilities/" className="icon db-icon">
                        <i className="fas fa-database"></i> 
                        <span className="hover-text">Database</span>
                    </Link>
                    <Link to="/community/" className="icon people">
                        <i className="fas fa-users"></i> 
                        <span className="hover-text">Community</span>
                    </Link>
                    <Link to="/faq/" className="icon faq">
                        <i className="fas fa-question"></i> 
                        <span className="hover-text">FAQ</span>
                    </Link>
                    <Link to="/docs/" className="icon docs">
                        <i className="fas fa-file"></i>  
                        <span className="hover-text">Docs</span>
                    </Link>
                    <Link 
                        to={isLoggedIn ? `/reporters/${user?.id}` : '/login'} 
                        className="icon user-icon"
                    >
                        <i className="fas fa-user"></i>
                        <span className="hover-text">{isLoggedIn ? user?.name : 'Login'}</span>
                    </Link>
                    <span className="icon bell-icon">
                        <i className="fas fa-bell"></i>
                        <span className="hover-text">Notifications</span>
                    </span>
                    <span className="icon git-icon">
                        <i className="fab fa-github"></i>
                        <span className="hover-text">Git repo</span>
                    </span>  
                    {isLoggedIn && (
                        <Link 
                            className="icon logout-icon" 
                            onClick={handleLogout} 
                            style={{ opacity: 1, cursor: 'pointer' }}
                        >
                            <i className="fas fa-sign-out-alt"></i>
                            <span className="hover-text">Logout</span>
                        </Link>
                    )}
                </div>
            </div>
            {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map(result => (
                        <div key={result.id} className="search-result-item">
                            <Link to={`/vulnerabilities/${result.id}`} onClick={handleResultClick}>
                                {sanitizeHtml(result.title)}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Header;
