import axios from 'axios';

// Create an axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // backend URL
});

// Add a request interceptor to include token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
