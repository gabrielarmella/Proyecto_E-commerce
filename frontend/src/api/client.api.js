import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const extractErrorMessage = (error, fallback = "Unexpected error") => {
  const data = error?.response?.data;
  if (data?.error?.message) return data.error.message;
  if (data?.message) return data.message;
  if (error?.message) return error.message;
  return fallback;
};

export default client;
