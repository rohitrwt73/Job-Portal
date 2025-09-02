// src/services/apiConfig.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`
    },
    JOBS: {
        BASE: `${API_BASE_URL}/api/jobs`,
        SEARCH: `${API_BASE_URL}/api/jobs/search`
    }
};

export default API_BASE_URL;