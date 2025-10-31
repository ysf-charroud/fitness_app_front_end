import axios from "axios";
import store from "../redux/store";
import { setToken, resetAuth } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ORIGIN,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send/receive cookies (e.g., refresh token)
});

// Attach token from Redux
api.interceptors.request.use(
  function (config) {
    const token = store.getState().auth.token;
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
  function onFulfilled(response) {
    return response;
  },
  async function onRejected(error) {
    const originalRequest = error.config;

    // Access token expired
    const status = error?.response?.status;
    const isRefreshCall = originalRequest?.url?.includes("/api/auth/refresh");
    if (status === 401 && !originalRequest?.sent && !isRefreshCall) {
      originalRequest.sent = true;
      try {
        const response = await api.post("/api/auth/refresh", {}, { withCredentials: true });
        const { accessToken } = response.data;
        store.dispatch(setToken(accessToken));
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (e.g., 401/403/404) -> clear auth and let app redirect
        store.dispatch(resetAuth());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
