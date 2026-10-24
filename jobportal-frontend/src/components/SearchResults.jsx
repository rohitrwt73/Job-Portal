import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import jobService from '../services/jobService';
import JobList from './JobList';

const SearchResults = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const title = (params.get('title') || '').trim().toLowerCase();
    const loc = (params.get('location') || '').trim().toLowerCase();

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await jobService.getLiveRemoteJobs();
        const allJobs = response.data || [];

        const filteredJobs = allJobs.filter((job) => {
          const jobTitle = (job.title || '').toLowerCase();
          const jobLocation = (job.location || '').toLowerCase();

          const matchesTitle = !title || jobTitle.includes(title);
          const matchesLocation = !loc || jobLocation.includes(loc);

          return matchesTitle && matchesLocation;
        });

        setSearchResults(filteredJobs);
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
          <JobList jobs={searchResults} />
        )}
      </div>
    </div>
  );
};

export default SearchResults;