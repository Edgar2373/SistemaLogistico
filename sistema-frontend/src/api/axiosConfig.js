
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    // No enviar token en login/registro (no lo necesitan y causa 403 si el token es viejo)
    if (token && !config.url.includes("/api/auth/")) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;