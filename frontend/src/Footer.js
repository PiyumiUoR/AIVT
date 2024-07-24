import React from 'react';
// import { Link } from 'react-router-dom';
import './Footer.css'; 

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-container">
                <i className="fas fa-copyright"></i>
                <span> 2024 AI Vulnerability Taxonomy</span>
                <div>
                    <p >Privacy Policy </p>
                    <span>&amp;</span>
                    <p > Terms and Conditions</p>
                </div>
            </div>
        {/* <span>© 2024 <a href="https://avidml.org/arva">AI Vulnerability Taxonomy</a></span>
        <div>
            <a href="https://avidml.org/legal/privacy">Privacy Policy</a>
            <span>&amp;</span>
            <a href="https://avidml.org/legal/terms-and-conditions">Terms and Conditions</a>
        </div> */}
        </footer>
    );
};

export default Footer;

