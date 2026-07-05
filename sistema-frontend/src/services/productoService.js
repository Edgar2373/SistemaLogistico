import api from "../api/axiosConfig";

export const getProductos = async () => {
  const response = await api.get("/productos");
  return response.data;
};

export const crearProducto = async (datos) => {
  const response = await api.post("/productos", datos);
  return response.data;
};

export const actualizarProducto = async (id, datos) => {
  const response = await api.put(`/productos/${id}`, datos);
  return response.data;
};

export const eliminarProducto = async (id) => {
  await api.delete(`/productos/${id}`);
};
