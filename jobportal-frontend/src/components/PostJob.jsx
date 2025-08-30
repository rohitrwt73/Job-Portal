import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jobService from "../services/jobService";

export default function PostJob() {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (
      !jobData.title ||
      !jobData.description ||
      !jobData.company ||
      !jobData.location
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      await jobService.createJob(jobData);
      setSuccess("Job posted successfully!");
      setJobData({
        title: "",
        description: "",
        company: "",
        location: "",
      });
      setTimeout(() => navigate("/find-jobs"), 1500);
    } catch (err) {
      console.error("Error posting job:", err);
      setError(err.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-indigo-100">
        <h2 className="text-center text-4xl font-bold text-gray-900">
          🚀 Post a <span className="text-indigo-600">New Job</span>
        </h2>
        <p className="text-center text-gray-600 text-sm">
          Fill in the details below and connect with top talent instantly.
        </p>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm text-center shadow">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm text-center shadow">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 text-gray-900 placeholder-gray-400"
              placeholder="Job Title"
              value={jobData.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <textarea
              id="description"
              name="description"
              required
              className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 text-gray-900 placeholder-gray-400"
              placeholder="Job Description"
              value={jobData.description}
              onChange={handleChange}
              rows="5"
            ></textarea>
          </div>
          <div>
            <input
              id="company"
              name="company"
              type="text"
              required
              className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 text-gray-900 placeholder-gray-400"
              placeholder="Company Name"
              value={jobData.company}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="location"
              name="location"
              type="text"
              required
              className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 text-gray-900 placeholder-gray-400"
              placeholder="Location"
              value={jobData.location}
              onChange={handleChange}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 px-6 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
