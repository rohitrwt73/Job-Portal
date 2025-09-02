// src/services/jobService.js
import axios from 'axios';
import { API_ENDPOINTS } from './apiConfig';

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

export const getAllJobs = () => axios.get(API_ENDPOINTS.JOBS.BASE); // Public access
const getJobById = (id) => axios.get(`${API_ENDPOINTS.JOBS.BASE}/${id}`, authHeader());
const createJob = (job) => axios.post(API_ENDPOINTS.JOBS.BASE, job, authHeader());
const updateJob = (id, job) => axios.put(`${API_ENDPOINTS.JOBS.BASE}/${id}`, job, authHeader());
const deleteJob = (id) => axios.delete(`${API_ENDPOINTS.JOBS.BASE}/${id}`, authHeader());

const jobService = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs: (title, location) =>
    axios.get(API_ENDPOINTS.JOBS.SEARCH, {
      params: { title, location },
    }), // Public access
};

export default jobService;