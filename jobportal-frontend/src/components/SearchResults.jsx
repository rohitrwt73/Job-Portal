import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import jobService from '../services/jobService';
import JobList from './JobList'; // Import the JobList component

const SearchResults = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [titleFilter, setTitleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const title = params.get('title') || '';
    const loc = params.get('location') || '';
    setTitleFilter(title);
    setLocationFilter(loc);

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const jobs = await jobService.searchJobs(title, loc);
        setSearchResults(jobs);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Search Results
        </h1>
        {loading && <div className="text-center">Loading search results...</div>}
        {error && <div className="text-center text-red-600">Error: {error}</div>}
        {!loading && !error && (
          <JobList jobs={searchResults} titleFilter={titleFilter} locationFilter={locationFilter} />
        )}
      </div>
    </div>
  );
};

export default SearchResults;
