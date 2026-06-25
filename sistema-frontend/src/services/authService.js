import api from "../api/axiosConfig";

// Función de login: envía usuario y contraseña al backend
// Retorna: { token, rol, nombre, idUsuario }
export const login = async (usuario, password) => {
    const response = await api.post("/api/auth/login", {
        usuario,
        password
    });
    return response.data;
};

// Función de registro: envía los datos del nuevo usuario al backend
// Retorna: { token, rol, nombre, idUsuario }
export const register = async (datos) => {
    const response = await api.post("/api/auth/register", {
        nombre: datos.nombre,
        telefono: datos.telefono,
        usuario: datos.usuario,
        email: datos.email,
        password: datos.password,
        rol: datos.rol
    });
    return response.data;
};