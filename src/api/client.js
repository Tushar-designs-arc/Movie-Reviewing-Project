import axios from "axios";
import { API_BASE_URL, API_ORIGIN, API_TIMEOUT } from "../config/config.js";

// Keep request policy in one place so protected admin modules behave consistently.
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem("ott_user");
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(error);
  },
);

export const mediaUrl = (url = "") => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) {
    if (
      typeof window !== "undefined" &&
      window.location?.protocol === "https:" &&
      url.startsWith("http://")
    ) {
      return url.replace(/^http:\/\//, "https://");
    }
    return url;
  }
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
};

export default api;
