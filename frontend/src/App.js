import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css'; 
import ReportVulnerability from './ReportVulnerability';
import EditVulnerability from './EditVulnerability';
import DeleteVulnerability from './DeleteVulnerability';
import Vulnerabilities from './Vulnerabilities';
import VulnerabilityDetail from './VulnerabilityDetail';
import SearchResults from './SearchResults';
import ProtectedRouteReporter from './ProtectedRouteReporter'; 
import ReviewVulnerability from './ReviewVulnerability';
import ProtectedRouteAdmin from './ProtectedRouteAdmin';
import PendingList from './PendingList';
import Login from './Login';
import Signup from './Signup';
import Header from './Header';
import Footer from './Footer';

const App = () => {
  const searchRef = useRef(null);
  const welcomeRef = useRef(null);

  const scrollToWelcome = () => {
    if (welcomeRef.current) {
      welcomeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Router>
      <div className="app">
      <Header scrollToWelcome={scrollToWelcome} />
        <Routes>
          <Route path="/" element={
            <main className="app-main">
              <div className="content">
                <div className="welcome-section" ref={welcomeRef}>
                  <h1>AI Vulnerability Taxonomy</h1>
                  <h1>(AIVT)</h1>
                  <p>Welcome to AIVT, the AI Vulnerability Taxonomy Database. We are dedicated to identifying, analyzing, and mitigating vulnerabilities in AI systems to ensure their safety, security, and reliability. Our mission is to provide a comprehensive and accessible platform for reporting and sharing information about AI vulnerabilities, fostering a collaborative community among AI developers, researchers, and users.</p>
                  {/* <button className="records-button">Total number of records: {totalRecords}</button> */}
                </div>
                <div className="mission-section">
                  <p>At AIVT, we believe that transparency and collaboration are key to advancing AI technology responsibly. By offering a centralized database and a user-friendly reporting system, we aim to help organizations and individuals stay informed about potential risks and improve the robustness of AI systems. Join us in our commitment to making AI safer and more trustworthy for everyone.</p>
                </div>
                <div className="report-section">
                  <h1>Report new vulnerability</h1>
                </div>
                <div className="button-container">
                  <p>
                    <Link to="/vulnerabilities/add/">
                      <button className="report-button">Start here...</button>
                    </Link>
                  </p>
                </div>

                <div className="rights-section" ref={searchRef}>
                  <p>Our database is designed to help you find detailed information on a wide range of AI vulnerabilities reported by experts, researchers, and users from around the globe. Whether you are looking for specific issues related to datasets, models, or entire systems, our search functionality allows you to quickly access and filter through comprehensive reports, classifications, and supporting data.</p>
                  <p>To start your search, simply enter keywords or use advanced filters to narrow down your results. You can search by vulnerability type, affected artifact, lifecycle phase, and more. Our goal is to provide you with the insights you need to understand and address AI vulnerabilities effectively. If you have any questions or need assistance, please do not hesitate to reach out to our support team.</p>
                  <p>Happy searching, and thank you for contributing to a safer AI ecosystem!</p>
                  {/* <input type="text" placeholder="Search for vulnerability" className="vulnerability-search" /> */}
                </div>
                <Footer/>                
              </div>
            </main>
          } />
          <Route path='/vulnerabilities/' element={<Vulnerabilities />} />
          <Route path="/vulnerabilities/search-results" element={<SearchResults />} />
          <Route path="/vulnerabilities/pending" element={<ProtectedRouteAdmin element={PendingList} role={['admin']} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />          
          <Route path="/vulnerabilities/add/" element={<ProtectedRouteReporter element={ReportVulnerability} />} />
          <Route path="/vulnerabilities/:id/review/" element={<ProtectedRouteReporter element={ReviewVulnerability} />} />          
          <Route path="/vulnerabilities/:id/edit/" element={<ProtectedRouteReporter element={EditVulnerability} />} />
          <Route path="/vulnerabilities/:id/delete/" element={<ProtectedRouteReporter element={DeleteVulnerability} />} />
          <Route path="/vulnerabilities/:id/" element={<VulnerabilityDetail />} />
          
        </Routes>        
      </div>
    </Router>
  );
}

export default App;
