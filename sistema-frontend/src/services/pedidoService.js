import api from "../api/axiosConfig";

export const getPedidos = async () => {
  const response = await api.get("/pedidos");
  return response.data;
};

export const getPedidoPorId = async (id) => {
  const response = await api.get(`/pedidos/${id}`);
  return response.data;
};

export const getPedidosPorEstado = async (estado) => {
  const response = await api.get(`/pedidos/estado/${estado}`);
  return response.data;
};

export const getPedidosPorRepartidor = async (idRepartidor) => {
  const response = await api.get(`/pedidos/repartidor/${idRepartidor}`);
  return response.data;
};

export const getPedidosPorFechas = async (fechaInicio, fechaFin) => {
  const response = await api.get(`/pedidos/fechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  return response.data;
};

export const crearPedido = async (datos) => {
  const response = await api.post("/pedidos", datos);
  return response.data;
};

export const crearPedidoCompleto = async (datos) => {
  const response = await api.post("/pedidos/completo", datos);
  return response.data;
};

export const actualizarPedido = async (id, datos) => {
  const response = await api.put(`/pedidos/${id}`, datos);
  return response.data;
};

export const eliminarPedido = async (id) => {
  await api.delete(`/pedidos/${id}`);
};
