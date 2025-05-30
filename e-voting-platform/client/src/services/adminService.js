import api from "./api";

const ADMIN_BASE_URL = "/admin";

export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllVoters = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE_URL}/voters`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
