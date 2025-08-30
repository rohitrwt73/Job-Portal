// src/services/jobService.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/jobs';

// 🔐 Add JWT token from localStorage
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };
};

export const getAllJobs = () => axios.get(API_BASE_URL); // Public access
const getJobById = (id) => axios.get(`${API_BASE_URL}/${id}`, authHeader());
const createJob = (job) => axios.post(API_BASE_URL, job, authHeader());
const updateJob = (id, job) => axios.put(`${API_BASE_URL}/${id}`, job, authHeader());
const deleteJob = (id) => axios.delete(`${API_BASE_URL}/${id}`, authHeader());

const jobService = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs: (title, location) =>
    axios.get(`${API_BASE_URL}/search`, {
      params: { title, location },
    }), // Public access
};

export default jobService;