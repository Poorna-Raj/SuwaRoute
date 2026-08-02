import axios from "axios";

// Default to same origin /api which routes to our Express server or Spring backend proxy
const DEFAULT_BASE_URL = "/api";

export const getStoredBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("suwaroute_api_base_url") || DEFAULT_BASE_URL;
  }
  return DEFAULT_BASE_URL;
};

export const setStoredBaseUrl = (url: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("suwaroute_api_base_url", url);
    window.location.reload();
  }
};

export const apiClient = axios.create({
  baseURL: getStoredBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  config.baseURL = getStoredBaseUrl();
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Response:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
