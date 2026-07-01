import api from "../api/axiosConfig";

// LISTAR todos los usuarios
export const getUsuarios = async () => {
  const response = await api.get("/usuarios");
  return response.data;
};

// CREAR un usuario
export const crearUsuario = async (datos) => {
  const response = await api.post("/usuarios", datos);
  return response.data;
};

// ACTUALIZAR un usuario
export const actualizarUsuario = async (id, datos) => {
  const response = await api.put(`/usuarios/${id}`, datos);
  return response.data;
};

// ELIMINAR un usuario
export const eliminarUsuario = async (id) => {
  await api.delete(`/usuarios/${id}`);
};