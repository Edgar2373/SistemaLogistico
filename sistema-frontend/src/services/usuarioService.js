import api from "../api/axiosConfig";

// Obtener todos los usuarios
// GET /usuarios
export const getUsuarios = async () => {
  const response = await api.get("/usuarios");
  return response.data;
};

// Obtener un usuario por ID
// GET /usuarios/{id}
export const getUsuarioById = async (id) => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

// Crear usuario (a través del endpoint de registro del AuthController para que encripte la contraseña)
// POST /api/auth/register
export const createUsuario = async (usuarioData) => {
  const response = await api.post("/api/auth/register", {
    nombre: usuarioData.nombre,
    telefono: usuarioData.telefono,
    usuario: usuarioData.usuario,
    email: usuarioData.email,
    password: usuarioData.password,
    rol: usuarioData.rol
  });
  return response.data;
};

// Actualizar usuario
// PUT /usuarios/{id}
export const updateUsuario = async (id, usuarioData) => {
  const response = await api.put(`/usuarios/${id}`, {
    idUsuario: id,
    nombre: usuarioData.nombre,
    telefono: usuarioData.telefono,
    usuario: usuarioData.usuario,
    email: usuarioData.email,
    passwordHash: usuarioData.passwordHash,
    rol: usuarioData.rol,
    estadoUsuario: usuarioData.estadoUsuario
  });
  return response.data;
};

// Eliminar usuario
// DELETE /usuarios/{id}
export const deleteUsuario = async (id) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
};
