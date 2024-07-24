import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const Header = ({ scrollToWelcome }) => {
    const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const searchBarRef = useRef(null);

    const toggleSearchBar = () => {
        setIsSearchBarVisible(prevState => !prevState);
    };

    const openLoginModal = () => setIsLoginOpen(true);
    const closeLoginModal = () => setIsLoginOpen(false);

    const openSignupModal = () => setIsSignupOpen(true);
    const closeSignupModal = () => setIsSignupOpen(false);

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

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="logo-container">
                    <h1 className="logo">AIVT</h1>
                </div>
                <nav className="nav-buttons">
                    <Link to="/" className="nav-button" onClick={scrollToWelcome}>
                        <i className="fas fa-home"></i> Home
                    </Link>
                    <Link to="/vulnerabilities/" className="nav-button">
                        <i className="fas fa-database"></i> Database
                    </Link>
                    <Link to="/community/" className="nav-button">
                        <i className="fas fa-users"></i> Community
                    </Link>
                    <Link to="/faq/" className="nav-button">
                        <i className="fas fa-question"></i> FAQ
                    </Link>
                    <button className="nav-button" onClick={toggleSearchBar}>
                        <i className="fas fa-search"></i> Search
                    </button>
                    <Link to="/docs/" className="nav-button">
                        <i className="fas fa-file"></i> Docs 
                    </Link>
                </nav>
                <div className="header-icons">
                    <span className="icon user-icon">
                        <i className="fas fa-user"></i>
                        <span className="hover-text">
                            <span className='auth-link' onClick={openLoginModal}>
                                Login
                            </span> / 
                            <span className='auth-link' onClick={openSignupModal}>
                                Sign up
                            </span>
                        </span>
                    </span>
                    <span className="icon db-icon">
                        <i className="fas fa-bell"></i>
                        <span className="hover-text">Notifications</span>
                    </span>
                    <span className="icon git-icon">
                        <i className="fab fa-github"></i>
                        <span className="hover-text">Git repo</span>
                    </span>            
                </div>
            </div>
            {isSearchBarVisible && (
                <div className="search-bar" ref={searchBarRef}>
                    <input type="text" placeholder="Search for vulnerability" className="vulnerability-search" />
                </div>
            )}

            <LoginModal isOpen={isLoginOpen} onRequestClose={closeLoginModal} />
            <SignupModal isOpen={isSignupOpen} onRequestClose={closeSignupModal} />
        </header>
    );
};

export default Header;
