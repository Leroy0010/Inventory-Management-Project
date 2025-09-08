// src/lib/axiosClient.ts
import axios, { AxiosError, type AxiosInstance } from "axios";

// =======================
// Token Store (In-memory)
// =======================
// This prevents XSS from stealing your token
let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
};

// =======================
// Axios Instance
// =======================
const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  withCredentials: true, // 👈 Important: allows sending/receiving cookies (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// Request Interceptor
// =======================
axiosClient.interceptors.request.use(
  (config) => {
    const token = tokenStore.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// Response Interceptor
// =======================
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If unauthorized and we haven’t retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Hit refresh endpoint (refresh token comes from HttpOnly cookie)
        const res = await axiosClient.post("/auth/refresh", {});
        const newToken = (res.data as { accessToken: string }).accessToken;

        tokenStore.set(newToken);

        // Update header and retry request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        tokenStore.clear();
        // Optional: redirect to login page
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
