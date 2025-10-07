import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ORGIN, // Base URL for all requests made with this instance
  timeout: 5000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
