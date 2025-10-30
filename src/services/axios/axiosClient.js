// services/axios/axiosClient.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: { 
    "Content-Type": "application/json"
  },
});

// Interceptor corrigé
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("🔄 Interceptor - Token trouvé:", token ? "OUI" : "NON");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Headers envoyés:", config.headers);
    } else {
      console.warn("⚠️ Aucun token trouvé dans localStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pour debug des réponses
api.interceptors.response.use(
  (response) => {
    console.log("✅ Réponse reçue:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("❌ Erreur API:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;