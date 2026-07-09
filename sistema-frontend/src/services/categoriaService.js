import api from "../api/axiosConfig";

export const getCategorias = async () => {
  const response = await api.get("/categorias");
  return response.data;
};

export const crearCategoria = async (datos) => {
  const response = await api.post("/categorias", datos);
  return response.data;
};

export const eliminarCategoria = async (id) => {
  await api.delete(`/categorias/${id}`);
};
