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
        let fetchedJobs = [];

        if (titleFilter || locationFilter) {
          const response = await jobService.searchJobs(titleFilter, locationFilter);
          fetchedJobs = response.data || [];
        } else {
          const response = await jobService.getLiveRemoteJobs();
          fetchedJobs = response.data || [];
        }

        setJobList(fetchedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (!jobs) {
      fetchJobs();
    } else {
      setJobList(Array.isArray(jobs) ? jobs : []);
      setLoading(false);
    }
  }, [jobs, titleFilter, locationFilter]);

  if (loading) {
    return <div className="text-center py-8 text-gray-700 font-medium">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600 font-semibold">Error: {error}</div>;
  }

  if (jobList.length === 0) {
    return <div className="text-center py-8 text-gray-600 font-medium">No jobs found.</div>;
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-violet-50 to-white">
      <div className="container mx-auto">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-center mb-10">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Live Jobs
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {jobList.map((job) => (
            <div
              key={job.id || job.url || `${job.title}-${job.company}`}
              className="bg-violet-50/90 border border-violet-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
            >
              <h3 className="text-2xl font-bold text-violet-700 mb-3 leading-snug">
                {job.title}
              </h3>

              <p className="text-base font-semibold text-gray-700 mb-3">
                {job.company} <span className="text-gray-500 font-medium">•</span> {job.location}
              </p>

              <p className="text-sm leading-6 text-gray-700 font-medium line-clamp-3">
                {job.description}
              </p>

              <div className="mt-6 flex justify-end">
                <a
                  href={job.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-base font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobList;