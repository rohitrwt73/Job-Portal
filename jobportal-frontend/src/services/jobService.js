import axios from 'axios';
import { API_ENDPOINTS } from './apiConfig';

const sanitizeText = (text) => {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
};

export const getAllJobs = () => axios.get(API_ENDPOINTS.JOBS.BASE);

export const getLiveRemoteJobs = async () => {
  const response = await axios.get(`${API_ENDPOINTS.JOBS.BASE}/live`);
  return {
    data: (response.data || []).map((job, index) => ({
      id: job.id ?? `${job.url ?? "remoteok"}-${index}`,
      title: job.position ?? job.title ?? "No title",
      company: job.company ?? "Unknown",
      location: job.location ?? "Remote",
      description: sanitizeText(job.description ?? ""),
      url: job.url ?? "#",
    })),
  };
};

const getJobById = (id) => axios.get(`${API_ENDPOINTS.JOBS.BASE}/${id}`);
const createJob = (job) => axios.post(API_ENDPOINTS.JOBS.BASE, job);
const updateJob = (id, job) => axios.put(`${API_ENDPOINTS.JOBS.BASE}/${id}`, job);
const deleteJob = (id) => axios.delete(`${API_ENDPOINTS.JOBS.BASE}/${id}`);

const jobService = {
  getAllJobs,
  getLiveRemoteJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs: (title, location) =>
    axios.get(API_ENDPOINTS.JOBS.SEARCH, {
      params: { title, location },
    }),
};

export default jobService;