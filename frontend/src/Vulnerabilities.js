import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Vulnerabilities.css';
import Footer from './Footer';

const Vulnerabilities = () => {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [phase, setPhase] = useState('');
  const [attribute, setAttribute] = useState('');
  const [effect, setEffect] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetch(`/api/vulnerabilities?approval_status=approved&phase=${phase}&attribute=${attribute}&effect=${effect}&startDate=${startDate}&endDate=${endDate}`)
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
  }, [phase, attribute, effect, startDate, endDate]);

  const clearFilters = () => {
    setPhase('');
    setAttribute('');
    setEffect('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div>
      <div className="vulnerability-list">
        <h1>Vulnerability List</h1>
        <div className="filters">
          <label>
            Phase:
            <select value={phase} onChange={e => setPhase(e.target.value)}>
              <option value="">All</option>
              <option value="Development">Development</option>
              <option value="Training">Training</option>
              <option value="Deployment and Use">Deployment and Use</option>
            </select>
          </label>
          <label>
            Attribute:
            <select value={attribute} onChange={e => setAttribute(e.target.value)}>
              <option value="">All</option>
              <option value="Accuracy">Accuracy</option>
              <option value="Fairness">Fairness</option>
              <option value="Privacy">Privacy</option>
              <option value="Reliability">Reliability</option>
              <option value="Resiliency">Resiliency</option>
              <option value="Robustness">Robustness</option>
              <option value="Safety">Safety</option>
            </select>
          </label>
          <label>
            Effect:
            <select value={effect} onChange={e => setEffect(e.target.value)}>
              <option value="">All</option>
              <option value="0: Correct functioning">0: Correct functioning</option>
              <option value="1: Reduced functioning">1: Reduced functioning</option>
              <option value="2: No actions">2: No actions</option>
              <option value="3: Chaotic">3: Chaotic</option>
              <option value="4: Directed actions">4: Directed actions</option>
              <option value="5: Random actions OoB">5: Random actions OoB</option>
              <option value="6: Directed actions OoB">6: Directed actions OoB</option>
            </select>
          </label>
          <label>
            Start Date:
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </label>
          <label>
            End Date:
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </label>
          <Link onClick={clearFilters} className="clear-filters-button">Clear All Filters</Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date Added</th>
              <th>Title</th>
              <th>Artifact Name</th>
              <th>Phase</th>
              <th>Attribute</th>
              <th>Effect</th>
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
                <td>{new Date(vulnerability.date_added).toLocaleDateString()}</td>
                <td>
                  <Link to={`/vulnerabilities/${vulnerability.id}`}>
                    {vulnerability.title}
                  </Link>
                </td>
                <td>{vulnerability.artifactname}</td>
                <td>{vulnerability.phase}</td>
                <td>{vulnerability.attributes}</td>
                <td>{vulnerability.effectname}</td>
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
