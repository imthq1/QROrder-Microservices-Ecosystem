import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginAdmin = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
      username,
      password,
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};
