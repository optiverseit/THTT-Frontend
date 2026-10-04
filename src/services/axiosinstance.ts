import axios from "axios";
import {
  isSessionValid,
  touchSession,
  clearAuthSession,
} from "../utils/sessionManager";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// This runs before every API request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Strong frontend security: check if 30-min session or JWT token has expired
    if (token) {
      if (!isSessionValid()) {
        console.warn("[AxiosInstance] Session expired before request. Redirecting to login.");
        clearAuthSession();
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired. Redirecting to login."));
      } else {
        // Active request keeps the 30-minute session alive
        touchSession();
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// When access token expires or is unauthorized, redirect to login
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken || !isSessionValid()) {
          clearAuthSession();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
          refreshToken,
          {
            headers: {
              "Content-Type": "text/plain",
            },
          }
        );

        const newAccessToken = refreshResponse.data?.data;

        if (newAccessToken) {
          localStorage.setItem("token", newAccessToken);
          touchSession();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          clearAuthSession();
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } catch (refreshError) {
        clearAuthSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;