import api from "../api/axiosConfig";

export const getPedidos = async () => {
  const response = await api.get("/pedidos");
  return response.data;
};

export const crearPedido = async (datos) => {
  const response = await api.post("/pedidos", datos);
  return response.data;
};

export const actualizarPedido = async (id, datos) => {
  const response = await api.put(`/pedidos/${id}`, datos);
  return response.data;
};

export const eliminarPedido = async (id) => {
  await api.delete(`/pedidos/${id}`);
};
