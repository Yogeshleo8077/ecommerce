import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Important for cookies (if we use them)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // We will later get this token from Redux or localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Response interceptor to handle global errors (like token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      
      // If we are not already on the login page, redirect
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?redirect=' + window.location.pathname;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
