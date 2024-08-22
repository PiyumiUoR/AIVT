import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; 
import axios from 'axios';

const Header = ({ scrollToWelcome }) => {
    const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [searchResults, setSearchResults] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const searchBarRef = useRef(null);
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
                setUser(userData); // Update user state here
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

    const toggleSearchBar = () => {
        setIsSearchBarVisible(prevState => !prevState);
    };

    const handleClickOutside = (event) => {
        if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
            setIsSearchBarVisible(false);
        }
    };

    useEffect(() => {
        if (isSearchBarVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchBarVisible]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); 
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            try {
                const response = await axios.get(`/api/vulnerabilities/search/`, { params: { query: searchQuery } });
                setSearchResults(response.data);
            } catch (err) {
                console.error('Error fetching search results:', err);
            }
        }
    };

    const handleResultClick = () => {
        setIsSearchBarVisible(false);
    };

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="logo-container">
                    <h1 className="logo">AIVT</h1>
                </div>
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
                    <Link className="icon search" onClick={toggleSearchBar}>
                        <i className="fas fa-search"></i> 
                        <span className="hover-text">Search</span>
                    </Link>
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
            {isSearchBarVisible && (
                <div className="search-bar" ref={searchBarRef}>
                    <form onSubmit={handleSearchSubmit}>
                        <input 
                            type="text" 
                            placeholder="Search for vulnerability" 
                            className="vulnerability-search" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button type="submit">Search</button>
                    </form>
                    <div className="search-results">
                        {searchResults.map(result => (
                            <div key={result.id} className="search-result-item">
                                <Link to={`/vulnerabilities/${result.id}`} onClick={handleResultClick}>
                                    {result.title}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
