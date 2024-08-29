import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PendingList.css';
import Footer from './Footer';

const PendingList = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Fetch ID from URL parameters
  // const [vulnerability, setVulnerability] = useState(null);
  const [pendingReports, setPendingReports] = useState([]);
  const [rejectedReports, setRejectedReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch pending reports with optional startDate and endDate filters
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`/api/vulnerabilities/pending?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          console.log(data);
          const pending = data.filter((report) => report.approval_status === 'pending');
          const rejected = data.filter((report) => report.approval_status === 'rejected');
          setPendingReports(pending);
          setRejectedReports(rejected);
        } else {
          console.error('Fetched data is not an array:', data);
          setPendingReports([]);
          setRejectedReports([]);
        }
      })
      .catch((error) => console.error('Error fetching vulnerabilities:', error));
  }, [startDate, endDate]);

  // Fetch details of a specific vulnerability based on id
  useEffect(() => {
    if (!id) return; // Check if id is defined before making the request
    fetch(`/api/vulnerabilities/${id}`)
      .then((response) => response.json())
      // .then((data) => {
      //   console.log(data);
      //   setVulnerability(data);
      // })
      .catch((error) => console.error('Error fetching vulnerability details:', error));
  }, [id]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  // Handle the approve action
  const handleApprove = (reportId) => {
    if (!reportId) {
      console.error('Error: Vulnerability report ID is missing or invalid');
      return;
    }

    const token = localStorage.getItem('token');
    fetch(`/api/vulnerabilities/${reportId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ approval_status: 'approved' }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to approve the report');
        }
        console.log('Report approved successfully');
        window.location.reload();
      })
      .catch((error) => console.error('Error approving report:', error));
  };

  // Handle the reject action
  const handleReject = (reportId) => {
    if (!reportId) {
      console.error('Error: Vulnerability report ID is missing or invalid');
      return;
    }

    const token = localStorage.getItem('token');
    fetch(`/api/vulnerabilities/${reportId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ approval_status: 'rejected' }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to reject the report');
        }
        console.log('Report rejected successfully');
        window.location.reload();
      })
      .catch((error) => console.error('Error rejecting report:', error));
  };

  const handleMoreDetails = (reportId) => {
    navigate(`/vulnerabilities/${reportId}/review`);
  };

  return (
    <div>
      <div className="admin-dashboard">
        <div className="pending-reports">
          <h1>Admin Dashboard - Pending Vulnerability Reports</h1>
          <div className="filters">
            <label>Start Date:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <label>End Date:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button onClick={clearFilters} className="clear-filters-button">
              Clear All Filters
            </button>
          </div>
          <table className="vulnerabilities-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date Added</th>
                <th>Title</th>
                <th>Reporter Name</th>
                <th>Reporter Organization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingReports.map((report) => (
                <tr key={report.reportid}>
                  <td>{report.reportid}</td>
                  <td>{new Date(report.date_added).toLocaleDateString()}</td>
                  <td>{report.title}</td>
                  <td>{report.reportername}</td>
                  <td>{report.reporterorganization}</td>
                  <td>
                    <div className="button-container">
                      <button
                        onClick={() => handleApprove(report.reportid)}
                        className="approve-button"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(report.reportid)}
                        className="reject-button"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleMoreDetails(report.reportid)}
                        className="more-button"
                      >
                        More details...
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rejected-reports">
          <h1>Rejected Vulnerability Reports</h1>
          <table className="vulnerabilities-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date Added</th>
                <th>Title</th>
                <th>Reporter Name</th>
                <th>Reporter Organization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rejectedReports.map((report) => (
                <tr key={report.reportid}>
                  <td>
                    <Link to={`/vulnerabilities/${report.reportid}/review`}>{report.reportid}</Link>
                  </td>
                  <td>{new Date(report.date_added).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/vulnerabilities/${report.reportid}/review`}>{report.title}</Link>
                  </td>
                  <td>{report.reportername}</td>
                  <td>{report.reporterorganization}</td>
                  <td>
                    <button
                      onClick={() => handleMoreDetails(report.reportid)}
                      className="more-button"
                    >
                      More details...
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PendingList;
