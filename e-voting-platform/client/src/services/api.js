import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api"; // Backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptor to handle token refresh or global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      // localStorage.removeItem('evoting_token');
      // window.location.href = '/login'; // This might be too aggressive
      console.error("Unauthorized access or token expired.");
    }
    return Promise.reject(error);
  }
);

export default api;
