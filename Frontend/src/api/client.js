import axios from "axios";

export const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || "http://127.0.0.1:5000").replace(
  /\/$/,
  "",
);

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("ott_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const mediaUrl = (path = "") => {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
};

export default api;
