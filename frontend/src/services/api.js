import axios from 'axios';

// Always use relative path to leverage vite proxy during development
// This ensures requests go through the Vite proxy instead of directly to backend
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  responseType: 'json',
  maxRedirects: 5,
  // Don't validate status - let us handle errors
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    // Check if response is valid
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    // For 4xx and 5xx errors, create an error with the response attached
    const error = new Error(`Request failed with status ${response.status}`);
    error.response = response;
    return Promise.reject(error);
  },
  (error) => {
    // Handle specific network errors
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.error('Network error - connection timeout or network issue');
    }

    // Handle chunked encoding errors
    if (error.code === 'ERR_INCOMPLETE_CHUNKED_ENCODING' ||
      error.message?.includes('chunked')) {
      console.error('Chunked encoding error - possible server connection issue');
    }

    // Only redirect to login for 401 if user is already logged in and token is invalid
    // Don't redirect if we're already on login/register pages or if there's no token
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';

      // Only auto-logout and redirect if user has a token and is not on auth pages
      if (token && !isAuthPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
