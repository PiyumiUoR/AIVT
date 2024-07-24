import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Vulnerabilities.css';

const Vulnerabilities = () => {
  const [vulnerabilities, setVulnerabilities] = useState([]);

  useEffect(() => {
    fetch('/api/vulnerabilities/')
      .then(response => response.json())
      .then(data => setVulnerabilities(data))
      .catch(error => console.error('Error fetching vulnerabilities:', error));
  }, []);

  return (
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
              <td>{vulnerability.id}</td>
              <td>
                <Link to={`/vulnerabilities/${vulnerability.id}/`}>{vulnerability.title}</Link>
              </td>
              <td>{vulnerability.artifactname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Vulnerabilities;
