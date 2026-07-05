import api from "../api/axiosConfig";

export const getEstadosPedido = async () => {
  const response = await api.get("/estado-pedido");
  return response.data;
};

export const crearEstadoPedido = async (datos) => {
  const response = await api.post("/estado-pedido", datos);
  return response.data;
};

export const actualizarEstadoPedido = async (id, datos) => {
  const response = await api.put(`/estado-pedido/${id}`, datos);
  return response.data;
};

export const eliminarEstadoPedido = async (id) => {
  await api.delete(`/estado-pedido/${id}`);
};
