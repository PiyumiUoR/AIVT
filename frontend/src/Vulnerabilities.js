import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Vulnerabilities.css';
import Footer from './Footer';

const Vulnerabilities = () => {
  const [vulnerabilities, setVulnerabilities] = useState([]);

  useEffect(() => {
    fetch('/api/vulnerabilities/')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVulnerabilities(data);
        } else {
          console.error('Fetched data is not an array:', data);
          setVulnerabilities([]);
        }
      })
      .catch(error => console.error('Error fetching vulnerabilities:', error));
  }, []);

  return (
    <div>
      <div className="vulnerability-list">
        <h1>Vulnerability List</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Artifact Name</th>
            </tr>
          </thead>
          <tbody>
            {vulnerabilities.map(vulnerability => (
              <tr key={vulnerability.id}>
                <td>
                  <Link to={`/vulnerabilities/${vulnerability.id}`}>
                    {vulnerability.id}
                  </Link>
                </td>
                <td>
                  <Link to={`/vulnerabilities/${vulnerability.id}`}>
                    {vulnerability.title}
                  </Link>
                </td>
                <td>{vulnerability.artifactname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Vulnerabilities;
