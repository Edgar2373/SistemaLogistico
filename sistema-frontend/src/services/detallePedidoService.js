import api from "../api/axiosConfig";

export const getDetallesPedido = async () => {
  const response = await api.get("/detalle-pedido");
  return response.data;
};

export const crearDetallePedido = async (datos) => {
  const response = await api.post("/detalle-pedido", datos);
  return response.data;
};

export const actualizarDetallePedido = async (id, datos) => {
  const response = await api.put(`/detalle-pedido/${id}`, datos);
  return response.data;
};

export const eliminarDetallePedido = async (id) => {
  await api.delete(`/detalle-pedido/${id}`);
};
