import React, { useEffect, useState } from "react";
import jobService from "../services/jobService";

const JobList = ({ jobs, titleFilter, locationFilter }) => {
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedJobs;
        if (titleFilter || locationFilter) {
          // If filters are present, call the search API
          fetchedJobs = await jobService.searchJobs(
            titleFilter,
            locationFilter
          );
        } else {
          // Otherwise, fetch all jobs
          fetchedJobs = await jobService.getAllJobs();
        }
        setJobList(fetchedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if `jobs` prop is not provided, meaning this component is responsible for fetching
    if (!jobs) {
      fetchJobs();
    } else {
      setJobList(jobs); // If jobs are provided as a prop, use them directly
      setLoading(false);
    }
  }, [jobs, titleFilter, locationFilter]);

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (jobList.length === 0) {
    return <div className="text-center py-8 text-gray-600">No jobs found.</div>;
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Available Jobs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobList.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-700 mb-4 text-sm">
                {job.company} - {job.location}
              </p>
              <p className="text-gray-600 text-sm line-clamp-3">
                {job.description}
              </p>
              <div className="mt-4 flex justify-end">
                <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobList;
