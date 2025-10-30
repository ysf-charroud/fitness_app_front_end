import axios from "axios";
import store from "../redux/store";
import { setToken } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ORIGIN,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  function onFulfilled(response) {
    return response;
  },
  async function onRejected(error) {
    const originalRequest = error.config;

    // Access token expired
    if (error.response?.status === 401 && !originalRequest.sent) {
      originalRequest.sent = true;
      try {
        const response = await api.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );
        const { accessToken } = response.data;
        store.dispatch(setToken(accessToken));
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
