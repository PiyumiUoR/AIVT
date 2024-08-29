import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [pendingReports, setPendingReports] = useState([]);
    const [reporterId, setReporterId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Fetch current user to get reporterId
        axios.get('/api/auth/current-user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setReporterId(response.data.id);
                console.log(response.data);
            })
            .catch(error => console.error('Error fetching user data:', error));
        
        // Fetch pending reports
        axios.get('/vulnerabilities/pending', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => setPendingReports(response.data))
            .catch(error => console.error('Error fetching pending reports:', error));
    }, []);

    const handleReview = (reportId, approvalStatus) => {
        if (!reporterId) {
            console.error('Reporter ID is not set');
            return;
        }

        const token = localStorage.getItem('token');
        axios.post(`/vulnerabilities/${reportId}/review`, { approval_status: approvalStatus, adminId: reporterId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                // Refresh the pending reports list
                setPendingReports(prevReports => prevReports.filter(report => report.id !== reportId));
            })
            .catch(error => console.error('Error reviewing report:', error));
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <ul>
                {pendingReports.map(report => (
                    <li key={report.id}>
                        <h3>{report.title}</h3>
                        <p>{report.report_description}</p>
                        <button onClick={() => handleReview(report.id, 'approved')}>Approve</button>
                        <button onClick={() => handleReview(report.id, 'rejected')}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
