import api from "../api/axiosConfig";

export const getPagos = async () => {
  const response = await api.get("/pagos");
  return response.data;
};

export const crearPago = async (datos) => {
  const response = await api.post("/pagos", datos);
  return response.data;
};

export const actualizarPago = async (id, datos) => {
  const response = await api.put(`/pagos/${id}`, datos);
  return response.data;
};

export const eliminarPago = async (id) => {
  await api.delete(`/pagos/${id}`);
};
