import api from "./api"; // Your configured Axios instance

// These functions are likely already implemented in your AuthContext.jsx
// This service would be useful if you want to call these from outside React components
// or if AuthContext becomes too large.

export const loginUser = async (credentials) => {
  // { aadhaarId, password } or { email, password }
  try {
    const response = await api.post("/auth/login", credentials);
    // Store token and user data (often done in AuthContext after this call)
    // localStorage.setItem('evoting_token', response.data.token);
    // api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    return response.data; // { user, token }
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const registerVoter = async (userData) => {
  // { name, email, aadhaarId, password }
  try {
    const response = await api.post("/auth/register", userData);
    // Store token and user data
    return response.data; // { user, token }
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const logoutUser = () => {
  // Clear token and user data (often done in AuthContext)
  localStorage.removeItem("evoting_token");
  delete api.defaults.headers.common["Authorization"];
  // No API call typically needed for basic JWT logout, but can be if backend tracks sessions
};

export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("evoting_token");
    if (!token) throw new Error("No token found");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await api.get("/auth/profile"); // Or your /users/profile route
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// You might add functions for:
// - Forgot password
// - Reset password
// - Verify email
