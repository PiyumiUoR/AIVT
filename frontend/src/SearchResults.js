import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Vulnerabilities.css';
import Footer from './Footer';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');

    if (query) {
      fetch(`/api/vulnerabilities/search/?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setSearchResults(data);
          } else {
            alert('No results found. Redirecting to the Vulnerabilities page.');
            navigate('/vulnerabilities');
          }
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          alert('An error occurred while fetching search results. Redirecting to the Vulnerabilities page.');
          navigate('/vulnerabilities');
        });
    } else {
      alert('Invalid search query. Redirecting to the Vulnerabilities page.');
      navigate('/vulnerabilities');
    }
  }, [location.search, navigate]);

  return (
    <div>
      <div className="vulnerability-list">
        <h1>Search Results</h1>
        <table>
          <thead>
            <tr>
            <th>ID</th>
              <th>Date Added</th>
              <th>Title</th>
              <th>Organization</th>
              <th>Artifact Name</th>
              <th>Phase</th>
              <th>Attributes</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map(result => (
              <tr key={result.id}>
                <td>
                  <Link to={`/vulnerabilities/${result.id}`}>
                    {result.id}
                  </Link>
                </td>
                <td>{new Date(result.date_added).toLocaleDateString()}</td>
                <td>
                  <Link to={`/vulnerabilities/${result.id}`}>
                    {result.title}
                  </Link>
                </td>
                <td>{result.organization}</td>
                <td>{result.artifactname}</td>                
                <td>{result.phase}</td>
                <td>{result.attributes}</td>
                <td>{result.effect}</td>
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

export default SearchResults;
