// services/axios/axiosClient.js
import axios from "axios";
import store from "../redux/store";
import { setToken } from "../redux/slices/authSlice";

// Variable to store the refresh token promise
let refreshTokenPromise = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ORIGIN,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate function to handle token refresh
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_ORIGIN}/api/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const { accessToken } = response.data;
    store.dispatch(setToken(accessToken));
    return accessToken;
  } finally {
    // Clear the promise reference when done (success or failure)
    refreshTokenPromise = null;
  }
};

api.interceptors.request.use(
  function (config) {
    const { token } = store.getState().auth;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors for non-refresh requests that haven't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Create or reuse existing refresh token request
        refreshTokenPromise = refreshTokenPromise || refreshAccessToken();

        // Wait for the token and retry the original request
        const accessToken = await refreshTokenPromise;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (error) {
        // Token refresh failed - reject with original error
        return Promise.reject(error);
      }
    }

    // For all other errors, just reject
    return Promise.reject(error);
  }
);

export default api;
