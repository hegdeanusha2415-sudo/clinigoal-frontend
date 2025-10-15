// src/api/api.js
import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({ 
  baseURL: "http://localhost:5000/api/admin",
  timeout: 30000, // 30 second timeout for file uploads
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    if (config.data instanceof FormData) {
      console.log("📦 Sending FormData with files");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.message}`);
    if (error.response) {
      console.error(`📊 Error status: ${error.response.status}`);
      console.error(`📋 Error data:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

// Videos API
export const fetchVideos = () => api.get("/videos").then(res => res.data);
export const uploadVideo = (formData) => api.post("/videos", formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const updateVideo = (id, formData) => api.put(`/videos/${id}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const deleteVideo = (id) => api.delete(`/videos/${id}`);

// Notes API (FIXED - with proper headers)
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000, // 30 second timeout for file uploads
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    if (config.data instanceof FormData) {
      console.log('Sending FormData with files');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`Response received: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Notes API
export const fetchNotes = () => api.get('/admin/notes').then(res => res.data);

export const uploadNote = (formData) => api.post('/admin/notes', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const deleteNote = (id) => api.delete(`/admin/notes/${id}`);


// Quizzes API
export const fetchQuizzes = () => api.get("/quizzes").then(res => res.data);
export const createQuiz = (data) => api.post("/quizzes", data);
export const updateQuiz = (id, data) => api.put(`/quizzes/${id}`, data);
export const deleteQuiz = (id) => api.delete(`/quizzes/${id}`);

export default api;