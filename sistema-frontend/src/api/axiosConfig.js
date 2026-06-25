
import axios from "axios";

// Crear instancia de axios con la URL base del backend
const api = axios.create({
    baseURL: "http://localhost:8000"
});

// Interceptor: se ejecuta ANTES de cada petición
// Si hay un token guardado, lo agrega al header Authorization automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;