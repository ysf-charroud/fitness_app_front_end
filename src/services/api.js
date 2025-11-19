import axios from "axios";
import store from "./redux/store";
import { setToken, resetAuth } from "./redux/slices/authSlice";

const apiOrigin = (import.meta.env.VITE_API_ORIGIN || "http://localhost:5000").replace(/\/$/, "");

const api = axios.create({
  baseURL: `${apiOrigin}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const isAuthRoute = (originalRequest?.url || "").includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        const response = await api.post("/auth/refresh", {}, { withCredentials: true });
        const { accessToken } = response.data;
        store.dispatch(setToken(accessToken));
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(resetAuth());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
